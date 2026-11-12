import LikeRepository from '../../Domains/likes/LikeRepository.js';

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async isCommentLiked(commentId, owner) {
    const query = {
      text: 'SELECT 1 FROM user_comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    return result.rowCount > 0;
  }

  async addLike(commentId, owner) {
    const query = {
      text: 'INSERT INTO user_comment_likes (comment_id, owner) VALUES ($1, $2)',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async getLikeCountsByThreadId(threadId) {
    const query = {
      text: `SELECT user_comment_likes.comment_id, COUNT(*)::int AS like_count
             FROM user_comment_likes
             INNER JOIN comments ON comments.id = user_comment_likes.comment_id
             WHERE comments.thread_id = $1
             GROUP BY user_comment_likes.comment_id`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteLike(commentId, owner) {
    const query = {
      text: 'DELETE FROM user_comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }
}

export default LikeRepositoryPostgres;