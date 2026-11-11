import NewThread from '../NewThread.js';

describe('NewThread entity', () => {
  it('should create NewThread correctly', () => {
    // Arrange
    const payload = {
      title: 'Belajar JavaScript',
      body: 'Diskusi tentang JavaScript',
      owner: 'user-123',
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.owner).toEqual(payload.owner);
  });

  it('should throw error when required property is missing', () => {
    // Arrange
    const payload = {
      title: 'Belajar JavaScript',
      body: 'Diskusi tentang JavaScript',
    };

    // Action and Assert
    expect(() => new NewThread(payload))
      .toThrowError(
        'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
      );
  });

  it('should throw error when data type is invalid', () => {
    // Arrange
    const payload = {
      title: 123,
      body: 'Diskusi tentang JavaScript',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new NewThread(payload))
      .toThrowError(
        'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
  });

  it('should throw error when payload is empty', () => {
    expect(() => new NewThread())
      .toThrowError(
        'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
      );
  });

  it('should throw error when property contains only whitespace', () => {
    const payload = {
      title: '   ',
      body: 'Diskusi JavaScript',
      owner: 'user-123',
    };

    expect(() => new NewThread(payload))
      .toThrowError(
        'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
      );
  });
});