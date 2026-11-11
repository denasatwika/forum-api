import { vi } from 'vitest';
import LikeRepository from '../../../Domains/likes/LikeRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import ToggleLikeCommentUseCase from '../ToggleLikeCommentUseCase.js';

describe('ToggleLikeCommentUseCase', () => {
  const useCasePayload = {
    threadId: 'thread-123',
    commentId: 'comment-123',
    owner: 'user-123',
  };

  it('should add like when user has not liked the comment', async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = vi.fn(() => Promise.resolve());
    mockLikeRepository.isCommentLiked = vi.fn(() => Promise.resolve(false));
    mockLikeRepository.addLike = vi.fn(() => Promise.resolve());
    mockLikeRepository.deleteLike = vi.fn(() => Promise.resolve());

    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith('comment-123', 'thread-123');
    expect(mockLikeRepository.isCommentLiked).toBeCalledWith('comment-123', 'user-123');
    expect(mockLikeRepository.addLike).toBeCalledWith('comment-123', 'user-123');
    expect(mockLikeRepository.deleteLike).not.toBeCalled();
  });

  it('should delete like when user has already liked the comment', async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = vi.fn(() => Promise.resolve());
    mockLikeRepository.isCommentLiked = vi.fn(() => Promise.resolve(true));
    mockLikeRepository.addLike = vi.fn(() => Promise.resolve());
    mockLikeRepository.deleteLike = vi.fn(() => Promise.resolve());

    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith('comment-123', 'thread-123');
    expect(mockLikeRepository.isCommentLiked).toBeCalledWith('comment-123', 'user-123');
    expect(mockLikeRepository.deleteLike).toBeCalledWith('comment-123', 'user-123');
    expect(mockLikeRepository.addLike).not.toBeCalled();
  });
});