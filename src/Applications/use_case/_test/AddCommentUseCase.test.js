import { vi } from 'vitest';
import NewComment from '../../../Domains/comments/entities/NewComment.js';
import AddedComment from '../../../Domains/comments/entities/AddedComment.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import AddCommentUseCase from '../AddCommentUseCase.js';

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = vi.fn()
      .mockImplementation(() => Promise.resolve(new AddedComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
      })));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    }));
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment(useCasePayload));
  });

  it('should not add comment when thread is not available', async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError('thread tidak ditemukan')));
    mockCommentRepository.addComment = vi.fn();

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(addCommentUseCase.execute({
      content: 'sebuah comment',
      threadId: 'thread-xxx',
      owner: 'user-123',
    })).rejects.toThrowError(NotFoundError);
    expect(mockCommentRepository.addComment).not.toBeCalled();
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-xxx');
  });

  it('should validate payload before checking thread availability', async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn();
    mockCommentRepository.addComment = vi.fn();

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(addCommentUseCase.execute({
      content: '',
      threadId: 'thread-xxx',
      owner: 'user-123',
    })).rejects.toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(mockThreadRepository.verifyThreadAvailability).not.toBeCalled();
    expect(mockCommentRepository.addComment).not.toBeCalled();
  });
});