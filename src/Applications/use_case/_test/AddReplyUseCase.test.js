import { vi } from 'vitest';
import NewReply from '../../../Domains/replies/entities/NewReply.js';
import AddedReply from '../../../Domains/replies/entities/AddedReply.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import AddReplyUseCase from '../AddReplyUseCase.js';

describe('AddReplyUseCase', () => {
  const useCasePayload = {
    content: 'sebuah balasan',
    threadId: 'thread-123',
    commentId: 'comment-123',
    owner: 'user-123',
  };

  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = vi.fn(() => Promise.resolve());
    mockReplyRepository.addReply = vi.fn(() => Promise.resolve(new AddedReply({
      id: 'reply-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    })));

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    }));
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith('comment-123', 'thread-123');
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply({
      content: 'sebuah balasan',
      commentId: 'comment-123',
      owner: 'user-123',
    }));
  });

  it('should not add reply when comment is not available in the thread', async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = vi.fn(() => Promise.reject(new NotFoundError('komentar tidak ditemukan')));
    mockReplyRepository.addReply = vi.fn();

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addReplyUseCase.execute(useCasePayload)).rejects.toThrowError(NotFoundError);
    expect(mockReplyRepository.addReply).not.toBeCalled();
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith('comment-123', 'thread-123');
  });

  it('should validate payload before checking availability', async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = vi.fn();
    mockCommentRepository.verifyCommentAvailability = vi.fn();
    mockReplyRepository.addReply = vi.fn();

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addReplyUseCase.execute({ ...useCasePayload, content: '' }))
      .rejects.toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    expect(mockThreadRepository.verifyThreadAvailability).not.toBeCalled();
    expect(mockCommentRepository.verifyCommentAvailability).not.toBeCalled();
    expect(mockReplyRepository.addReply).not.toBeCalled();
  });
});