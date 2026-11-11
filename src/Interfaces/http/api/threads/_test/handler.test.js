import GetThreadDetailUseCase from '../../../../../Applications/use_case/GetThreadDetailUseCase.js';
import ThreadsHandler from '../handler.js';

describe('ThreadsHandler', () => {
  let mockContainer;
  let mockGetThreadDetailUseCase;
  let threadsHandler;

  beforeEach(() => {
    mockGetThreadDetailUseCase = {
      execute: vi.fn(),
    };

    mockContainer = {
      getInstance: vi.fn().mockReturnValue(
        mockGetThreadDetailUseCase
      ),
    };

    threadsHandler = new ThreadsHandler(mockContainer);
  });

  describe('getThreadByIdHandler', () => {
    it('should response 200 and return thread detail correctly', async () => {
      // Arrange
      const mockThread = {
        id: 'thread-123',
        title: 'Belajar Backend',
        body: 'Belajar Clean Architecture',
        username: 'tester',
        comments: [],
      };

      mockGetThreadDetailUseCase.execute.mockResolvedValue(
        mockThread
      );

      const req = {
        params: {
          threadId: 'thread-123',
        },
      };

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const next = vi.fn();

      // Action
      await threadsHandler.getThreadByIdHandler(req, res, next);

      // Assert
      expect(mockContainer.getInstance)
        .toHaveBeenCalledWith(GetThreadDetailUseCase.name);

      expect(mockGetThreadDetailUseCase.execute)
        .toHaveBeenCalledWith('thread-123');

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          thread: {
            id: 'thread-123',
            title: 'Belajar Backend',
            body: 'Belajar Clean Architecture',
            username: 'tester',
            comments: [],
          },
        },
      });

      expect(next).not.toHaveBeenCalled();
    });

    it('should forward error when thread is not found', async () => {
      // Arrange
      const notFoundError = new Error('thread tidak ditemukan');

      mockGetThreadDetailUseCase.execute.mockRejectedValue(
        notFoundError
      );

      const req = {
        params: {
          threadId: 'thread-not-found',
        },
      };

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      const next = vi.fn();

      // Action
      await threadsHandler.getThreadByIdHandler(req, res, next);

      // Assert
      expect(mockContainer.getInstance).toHaveBeenCalledWith(GetThreadDetailUseCase.name);
      expect(mockGetThreadDetailUseCase.execute).toHaveBeenCalledWith('thread-not-found');
      expect(next).toHaveBeenCalledWith(new Error('thread tidak ditemukan'));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
