import { vi } from 'vitest';

import NewThread from '../../../Domains/threads/entities/NewThread.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddedThread from '../../../Domains/threads/entities/AddedThread.js';
import AddThreadUseCase from '../AddThreadUseCase.js';

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arange
    const useCasePayload = {
      title: 'Belajar JavaScript',
      body: 'Diskusi tentang JavaScript',
      owner: 'user-123',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = vi.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    }));

    expect(mockThreadRepository.addThread)
      .toBeCalledWith(new NewThread(useCasePayload));

    expect(mockThreadRepository.addThread).toBeCalledTimes(1);
  });
});