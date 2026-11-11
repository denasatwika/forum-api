import AddedComment from '../AddedComment.js';

describe('AddedComment entity', () => {
  it('should create AddedComment correctly', () => {
    // Arrange
    const payload = { id: 'comment-123', content: 'sebuah comment', owner: 'user-123' };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment).toBeInstanceOf(AddedComment);
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });

  it('should throw error when required property is missing', () => {
    // Arrange
    const payload = { id: 'comment-123', content: 'sebuah comment' };

    // Action and Assert
    expect(() => new AddedComment(payload))
      .toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data type is invalid', () => {
    // Arrange
    const payload = { id: 123, content: 'sebuah comment', owner: 'user-123' };

    // Action and Assert
    expect(() => new AddedComment(payload))
      .toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload is empty', () => {
    expect(() => new AddedComment()).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
});