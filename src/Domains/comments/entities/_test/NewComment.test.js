import NewComment from '../NewComment.js';

describe('NewComment entity', () => {
  it('should create NewComment correctly', () => {
    // Arrange
    const payload = {
      content: 'sebuah comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment).toBeInstanceOf(NewComment);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.owner).toEqual(payload.owner);
  });

  it('should throw error when required property is missing', () => {
    // Arrange
    const payload = { threadId: 'thread-123', owner: 'user-123' };

    // Action and Assert
    expect(() => new NewComment(payload))
      .toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data type is invalid', () => {
    // Arrange
    const payload = { content: 123, threadId: 'thread-123', owner: 'user-123' };

    // Action and Assert
    expect(() => new NewComment(payload))
      .toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload is empty', () => {
    expect(() => new NewComment())
      .toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when content contains only whitespace', () => {
    // Arrange
    const payload = { content: '   ', threadId: 'thread-123', owner: 'user-123' };

    // Action and Assert
    expect(() => new NewComment(payload))
      .toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
});