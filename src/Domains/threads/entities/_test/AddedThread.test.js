import AddedThread from '../AddedThread.js';

describe('Added Thread entity', () => {
  it('should create AddedThread correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Belajar JavaScript',
      owner: 'user-123',
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread).toBeInstanceOf(AddedThread);
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });

  it('should throw error when required property is missing', () => {
    const payload = {
      id: 'thread-123',
      title: 'Belajar JavaScript',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data type is invalid', () => {
    const payload = {
      id: 123,
      title: 'Belajar JavaScript',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when property contains only whitespace', () => {
    const payload = {
      id: 'thread-123',
      title: '  ',
      owner: 'user-123',
    };

    expect(() => new AddedThread(payload))
      .toThrowError(
        'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
      );
  });

  it('should throw error when payload is empty', () => {
    expect(() => new AddedThread()).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
});