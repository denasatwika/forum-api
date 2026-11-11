import request from 'supertest';

import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import ServerTestHelper from '../../../../tests/ServerTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js';
import container from '../../container.js';
import createServer from '../createServer.js';

const THREAD_ID = 'thread-functional-detail';
const OWNER_ID = 'user-functional-detail';

describe('/threads endpoint', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken();
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread', body: 'sebuah body thread' });

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedThread.title).toEqual('sebuah thread');
      expect(response.body.data.addedThread.owner).toEqual('user-123');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken();
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'sebuah thread' });

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message)
        .toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken();
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 123, body: ['sebuah body thread'] });

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message)
        .toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });

    it('should response 401 when request without access token', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .post('/threads')
        .send({ title: 'sebuah thread', body: 'sebuah body thread' });

      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 401 when authorization scheme is not Bearer', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .post('/threads')
        .set('Authorization', 'Basic abc123')
        .send({ title: 'sebuah thread', body: 'sebuah body thread' });

      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 401 when access token is invalid', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .post('/threads')
        .set('Authorization', 'Bearer token-asal')
        .send({ title: 'sebuah thread', body: 'sebuah body thread' });

      // Assert
      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 400 when request has no body', async () => {
      // Arrange
      const accessToken = await ServerTestHelper.getAccessToken();
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });
  });


  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return thread detail correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: OWNER_ID,
        username: 'functionalowner',
        password: 'secret',
        fullname: 'Functional Owner',
      });

      await ThreadsTableTestHelper.addThread({
        id: THREAD_ID,
        title: 'Belajar Forum API',
        body: 'Menguji fitur GET Thread Detail',
        owner: OWNER_ID,
      });

      const server = await createServer(container);

      // Action
      const response = await request(server)
        .get(`/threads/${THREAD_ID}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.thread).toMatchObject({
        id: THREAD_ID,
        title: 'Belajar Forum API',
        body: 'Menguji fitur GET Thread Detail',
        username: 'functionalowner',
        comments: [],
      });
    });

    it('should response 404 when thread is not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await request(server)
        .get('/threads/thread-not-found');

      // Assert
      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });

    it('should response comments sorted ascending and mask deleted comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'johndoe' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        owner: 'user-123',
        content: 'komentar rahasia',
        date: '2021-08-08T07:26:21.338Z',
        isDelete: true,
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-456',
        content: 'sebuah comment',
        date: '2021-08-08T07:22:33.555Z',
      });
      const app = await createServer(container);

      // Action
      const response = await request(app).get('/threads/thread-123');

      // Assert
      const { comments } = response.body.data.thread;
      expect(response.status).toEqual(200);
      expect(comments).toHaveLength(2);
      expect(comments[0]).toMatchObject({
        id: 'comment-123',
        username: 'johndoe',
        content: 'sebuah comment',
      });
      expect(comments[1]).toMatchObject({
        id: 'comment-456',
        username: 'dicoding',
        content: '**komentar telah dihapus**',
      });
      expect(typeof comments[0].date).toEqual('string');
      expect(comments[1]).not.toHaveProperty('isDelete');
      expect(comments[1]).not.toHaveProperty('is_delete');
      expect(JSON.stringify(response.body)).not.toContain('komentar rahasia');
    });

    it('should response replies inside each comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'johndoe' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
      await RepliesTableTestHelper.addReply({
        id: 'reply-456',
        commentId: 'comment-123',
        owner: 'user-123',
        content: 'sebuah balasan',
        date: '2021-08-08T08:07:01.522Z',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        owner: 'user-456',
        content: 'balasan rahasia',
        date: '2021-08-08T07:59:48.766Z',
        isDelete: true,
      });
      const app = await createServer(container);

      // Action
      const response = await request(app).get('/threads/thread-123');

      // Assert
      const { replies } = response.body.data.thread.comments[0];
      expect(response.status).toEqual(200);
      expect(replies).toHaveLength(2);
      expect(replies[0]).toMatchObject({
        id: 'reply-123',
        username: 'johndoe',
        content: '**balasan telah dihapus**',
      });
      expect(replies[1]).toMatchObject({
        id: 'reply-456',
        username: 'dicoding',
        content: 'sebuah balasan',
      });
      expect(typeof replies[0].date).toEqual('string');
      expect(replies[0]).not.toHaveProperty('commentId');
      expect(JSON.stringify(response.body)).not.toContain('balasan rahasia');
    });
  });
});
