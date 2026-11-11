import { vi } from 'vitest';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';
import DeleteCommentUseCase from '../DeleteCommentUseCase.js';

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = vi.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = vi.fn(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = vi.fn(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith('comment-123', 'thread-123');
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith('comment-123', 'user-123');
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith('comment-123');
  });

  it('should not delete comment when user is not the owner', async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = vi.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = vi.fn(() => Promise.reject(new AuthorizationError('forbidden')));
    mockCommentRepository.deleteCommentById = vi.fn();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute({
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-456',
    })).rejects.toThrowError(AuthorizationError);
    expect(mockCommentRepository.deleteCommentById).not.toBeCalled();
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith('comment-123', 'thread-123');
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith('comment-123', 'user-456');
  });
});