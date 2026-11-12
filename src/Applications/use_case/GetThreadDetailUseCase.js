import DetailComment from '../../Domains/comments/entities/DetailComment.js';
import DetailReply from '../../Domains/replies/entities/DetailReply.js';

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);
    const likeCounts = await this._likeRepository.getLikeCountsByThreadId(threadId);

    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: new Date(thread.date).toISOString(),
      username: thread.username,
      comments: comments.map((comment) => this._mapComment(comment, replies, likeCounts)),
    };
  }

  _mapComment(comment, replies, likeCounts) {
    const likeCountRow = likeCounts.find((row) => row.comment_id === comment.id);
    return new DetailComment({
      id: comment.id,
      username: comment.username,
      date: new Date(comment.date).toISOString(),
      content: comment.content,
      isDelete: comment.is_delete,
      likeCount: likeCountRow ? likeCountRow.like_count : 0,
      replies: replies
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => this._mapReply(reply)),
    });
  }

  _mapReply(reply) {
    return new DetailReply({
      id: reply.id,
      content: reply.content,
      date: new Date(reply.date).toISOString(),
      username: reply.username,
      isDelete: reply.is_delete,
    });
  }
}

export default GetThreadDetailUseCase;