import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import LikesTableTestHelper from '../../../../tests/LikesTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import LikeRepositoryPostgres from '../LikeRepositoryPostgres.js';

describe('LikeRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
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

  describe('isCommentLiked function', () => {
    it('should return false when user has not liked the comment', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      const isLiked = await likeRepositoryPostgres.isCommentLiked('comment-123', 'user-123');

      expect(isLiked).toEqual(false);
    });

    it('should return true when user has liked the comment', async () => {
      await LikesTableTestHelper.addLike({ commentId: 'comment-123', owner: 'user-123' });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      const isLiked = await likeRepositoryPostgres.isCommentLiked('comment-123', 'user-123');

      expect(isLiked).toEqual(true);
    });

    it('should return false when only another user has liked the comment', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'johndoe' });
      await LikesTableTestHelper.addLike({ commentId: 'comment-123', owner: 'user-456' });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      const isLiked = await likeRepositoryPostgres.isCommentLiked('comment-123', 'user-123');

      expect(isLiked).toEqual(false);
    });
  });

  describe('addLike function', () => {
    it('should persist like correctly', async () => {
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      await likeRepositoryPostgres.addLike('comment-123', 'user-123');

      const likes = await LikesTableTestHelper.findLike('comment-123', 'user-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should remove like from database', async () => {
      await LikesTableTestHelper.addLike({ commentId: 'comment-123', owner: 'user-123' });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      await likeRepositoryPostgres.deleteLike('comment-123', 'user-123');

      const likes = await LikesTableTestHelper.findLike('comment-123', 'user-123');
      expect(likes).toHaveLength(0);
    });
  });
});