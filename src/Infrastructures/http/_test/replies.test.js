import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js';
import ServerTestHelper from '../../../../tests/ServerTestHelper.js';
import container from '../../container.js';
import createServer from '../createServer.js';

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  const BASE_URL = '/threads/thread-123/comments/comment-123/replies';
  let accessToken;

  beforeEach(async () => {
    accessToken = await ServerTestHelper.getAccessToken();
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .post(BASE_URL)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah balasan' });

      const { addedReply } = response.body.data;
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(addedReply.content).toEqual('sebuah balasan');
      expect(addedReply.owner).toEqual('user-123');

      const replies = await RepliesTableTestHelper.findReplyById(addedReply.id);
      expect(replies).toHaveLength(1);
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .post(BASE_URL)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message)
        .toEqual('tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .post(BASE_URL)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: ['sebuah balasan'] });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message)
        .toEqual('tidak dapat membuat balasan baru karena tipe data tidak sesuai');
    });

    it('should response 400 when request has no body', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .post(BASE_URL)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 404 when thread is not found', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .post('/threads/thread-xxx/comments/comment-123/replies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah balasan' });

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 404 when comment is not found', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .post('/threads/thread-123/comments/comment-xxx/replies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'sebuah balasan' });

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 401 when request without access token', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .post(BASE_URL)
        .send({ content: 'sebuah balasan' });

      expect(response.status).toEqual(401);
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and soft delete the reply', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });
      const app = await createServer(container);

      const response = await request(app)
        .delete(`${BASE_URL}/reply-123`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual({ status: 'success' });

      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies[0].is_delete).toEqual(true);
    });

    it('should response 403 when user is not the reply owner', async () => {
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });
      const otherAccessToken = await ServerTestHelper.getAccessToken({ id: 'user-456', username: 'johndoe' });
      const app = await createServer(container);

      const response = await request(app)
        .delete(`${BASE_URL}/reply-123`)
        .set('Authorization', `Bearer ${otherAccessToken}`);

      expect(response.status).toEqual(403);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 404 when thread is not found', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .delete('/threads/thread-xxx/comments/comment-123/replies/reply-123')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(404);
    });

    it('should response 404 when comment is not found', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-xxx/replies/reply-123')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(404);
    });

    it('should response 404 when reply is not found', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .delete(`${BASE_URL}/reply-xxx`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 401 when request without access token', async () => {
      const app = await createServer(container);

      const response = await request(app)
        .delete(`${BASE_URL}/reply-123`);

      expect(response.status).toEqual(401);
    });
  });
});