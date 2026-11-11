import { vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import DetailComment from '../../../Domains/comments/entities/DetailComment.js';
import DetailReply from '../../../Domains/replies/entities/DetailReply.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import GetThreadDetailUseCase from '../GetThreadDetailUseCase.js';

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = vi.fn(() => Promise.resolve({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date('2021-08-08T07:19:09.775Z'),
      username: 'dicoding',
    }));
    mockCommentRepository.getCommentsByThreadId = vi.fn(() => Promise.resolve([
      {
        id: 'comment-123',
        username: 'johndoe',
        date: new Date('2021-08-08T07:22:33.555Z'),
        content: 'sebuah comment',
        is_delete: false,
      },
      {
        id: 'comment-456',
        username: 'dicoding',
        date: new Date('2021-08-08T07:26:21.338Z'),
        content: 'komentar rahasia',
        is_delete: true,
      },
    ]));
    mockReplyRepository.getRepliesByThreadId = vi.fn(() => Promise.resolve([
      {
        id: 'reply-123',
        comment_id: 'comment-123',
        username: 'dicoding',
        date: new Date('2021-08-08T07:59:48.766Z'),
        content: 'balasan rahasia',
        is_delete: true,
      },
      {
        id: 'reply-456',
        comment_id: 'comment-123',
        username: 'johndoe',
        date: new Date('2021-08-08T08:07:01.522Z'),
        content: 'sebuah balasan',
        is_delete: false,
      },
    ]));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute('thread-123');

    // Assert
    expect(threadDetail).toStrictEqual({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        new DetailComment({
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          isDelete: false,
          replies: [
            new DetailReply({
              id: 'reply-123',
              username: 'dicoding',
              date: '2021-08-08T07:59:48.766Z',
              content: 'balasan rahasia',
              isDelete: true,
            }),
            new DetailReply({
              id: 'reply-456',
              username: 'johndoe',
              date: '2021-08-08T08:07:01.522Z',
              content: 'sebuah balasan',
              isDelete: false,
            }),
          ],
        }),
        new DetailComment({
          id: 'comment-456',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: 'komentar rahasia',
          isDelete: true,
          replies: [],
        }),
      ],
    });
    expect(threadDetail.comments[0].replies[0].content).toEqual('**balasan telah dihapus**');
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith('thread-123');
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith('thread-123');
  });

  it('should not fetch comments and replies when thread is not found', async () => {
    // Arrange
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = vi.fn(() => Promise.reject(new NotFoundError('thread tidak ditemukan')));
    mockCommentRepository.getCommentsByThreadId = vi.fn();
    mockReplyRepository.getRepliesByThreadId = vi.fn();

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(getThreadDetailUseCase.execute('thread-xxx'))
      .rejects.toThrowError(NotFoundError);
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-xxx');
    expect(mockCommentRepository.getCommentsByThreadId).not.toBeCalled();
    expect(mockReplyRepository.getRepliesByThreadId).not.toBeCalled();
  });
});