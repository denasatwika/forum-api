import NewReply from '../NewReply.js';

describe('NewReply entity', () => {
  const validPayload = {
    content: 'sebuah balasan',
    commentId: 'comment-123',
    owner: 'user-123',
  };

  it('should create NewReply correctly', () => {
    const newReply = new NewReply(validPayload);

    expect(newReply).toBeInstanceOf(NewReply);
    expect(newReply.content).toEqual('sebuah balasan');
    expect(newReply.commentId).toEqual('comment-123');
    expect(newReply.owner).toEqual('user-123');
  });

  it('should throw error when required property is missing', () => {
    expect(() => new NewReply({ ...validPayload, content: undefined }))
      .toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data type is invalid', () => {
    expect(() => new NewReply({ ...validPayload, content: true }))
      .toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload is empty', () => {
    expect(() => new NewReply()).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when content contains only whitespace', () => {
    expect(() => new NewReply({ ...validPayload, content: '   ' }))
      .toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
});