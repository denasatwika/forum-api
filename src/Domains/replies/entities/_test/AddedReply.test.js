import AddedReply from '../AddedReply.js';

describe('AddedReply entity', () => {
  const validPayload = {
    id: 'reply-123',
    content: 'sebuah balasan',
    owner: 'user-123',
  };

  it('should create AddedReply correctly', () => {
    const addedReply = new AddedReply(validPayload);

    expect(addedReply).toBeInstanceOf(AddedReply);
    expect(addedReply.id).toEqual('reply-123');
    expect(addedReply.content).toEqual('sebuah balasan');
    expect(addedReply.owner).toEqual('user-123');
  });

  it('should throw error when required property is missing', () => {
    expect(() => new AddedReply({ ...validPayload, owner: undefined }))
      .toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data type is invalid', () => {
    expect(() => new AddedReply({ ...validPayload, id: 123 }))
      .toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload is empty', () => {
    expect(() => new AddedReply()).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
});