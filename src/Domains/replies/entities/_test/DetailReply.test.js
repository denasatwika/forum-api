import DetailReply from '../DetailReply.js';

describe('DetailReply entity', () => {
  const validPayload = {
    id: 'reply-123',
    content: 'sebuah balasan',
    date: '2021-08-08T07:59:48.766Z',
    username: 'johndoe',
    isDelete: false,
  };

  it('should create DetailReply correctly', () => {
    const detailReply = new DetailReply(validPayload);

    expect(detailReply).toBeInstanceOf(DetailReply);
    expect(detailReply.id).toEqual('reply-123');
    expect(detailReply.content).toEqual('sebuah balasan');
    expect(detailReply.date).toEqual('2021-08-08T07:59:48.766Z');
    expect(detailReply.username).toEqual('johndoe');
    expect(detailReply).not.toHaveProperty('isDelete');
  });

  it('should mask content when reply is deleted', () => {
    const detailReply = new DetailReply({ ...validPayload, isDelete: true });

    expect(detailReply.content).toEqual('**balasan telah dihapus**');
  });

  it('should throw error when required property is missing', () => {
    expect(() => new DetailReply({ ...validPayload, username: undefined }))
      .toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload is empty', () => {
    expect(() => new DetailReply()).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data type is invalid', () => {
    expect(() => new DetailReply({ ...validPayload, date: 2021 }))
      .toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new DetailReply({ ...validPayload, isDelete: 1 }))
      .toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});