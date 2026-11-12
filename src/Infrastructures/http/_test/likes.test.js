import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import LikesTableTestHelper from '../../../../tests/LikesTableTestHelper.js';
import ServerTestHelper from '../../../../tests/ServerTestHelper.js';
import container from '../../container.js';
import createServer from '../createServer.js';

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  const LIKE_URL = '/threads/thread-123/comments/comment-123/likes';
  let accessToken;

  beforeEach(async () => {
    accessToken = await ServerTestHelper.getAccessToken();
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and like the comment', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .put(LIKE_URL)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual({ status: 'success' });

      const likes = await LikesTableTestHelper.findLike('comment-123', 'user-123');
      expect(likes).toHaveLength(1);
    });

    it('should response 200 and unlike when comment already liked', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({ commentId: 'comment-123', owner: 'user-123' });
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .put(LIKE_URL)
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual({ status: 'success' });

      const likes = await LikesTableTestHelper.findLike('comment-123', 'user-123');
      expect(likes).toHaveLength(0);
    });

    it('should response 404 when thread is not found', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .put('/threads/thread-xxx/comments/comment-123/likes')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 404 when comment is not found', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app)
        .put('/threads/thread-123/comments/comment-xxx/likes')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });

    it('should response 401 when request without access token', async () => {
      // Arrange
      const app = await createServer(container);

      // Action
      const response = await request(app).put(LIKE_URL);

      // Assert
      expect(response.status).toEqual(401);
    });
  });
});