import { vi } from 'vitest';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';
import DeleteReplyUseCase from '../DeleteReplyUseCase.js';

describe('DeleteReplyUseCase', () => {
  const useCasePayload = {
    threadId: 'thread-123',
    commentId: 'comment-123',
    replyId: 'reply-123',
    owner: 'user-123',
  };

  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = vi.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyAvailability = vi.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = vi.fn(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = vi.fn(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith('comment-123', 'thread-123');
    expect(mockReplyRepository.verifyReplyAvailability).toBeCalledWith('reply-123', 'comment-123');
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith('reply-123', 'user-123');
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith('reply-123');
  });

  it('should not delete reply when user is not the owner', async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = vi.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyAvailability = vi.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = vi.fn(() => Promise.reject(new AuthorizationError('forbidden')));
    mockReplyRepository.deleteReplyById = vi.fn();

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute({ ...useCasePayload, owner: 'user-456' }))
      .rejects.toThrowError(AuthorizationError);
    expect(mockReplyRepository.deleteReplyById).not.toBeCalled();
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith('comment-123', 'thread-123');
    expect(mockReplyRepository.verifyReplyAvailability).toBeCalledWith('reply-123', 'comment-123');
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith('reply-123', 'user-456');
  });
});