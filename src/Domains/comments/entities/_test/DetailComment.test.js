import DetailComment from '../DetailComment.js';

describe('DetailComment entity', () => {
  const validPayload = {
    id: 'comment-123',
    username: 'dicoding',
    date: '2021-08-08T07:22:33.555Z',
    content: 'sebuah comment',
    isDelete: false,
    replies: [],
    likeCount: 0,
  };

  it('should create DetailComment correctly', () => {
    // Action
    const detailComment = new DetailComment(validPayload);

    // Assert
    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.id).toEqual('comment-123');
    expect(detailComment.username).toEqual('dicoding');
    expect(detailComment.date).toEqual('2021-08-08T07:22:33.555Z');
    expect(detailComment.content).toEqual('sebuah comment');
    expect(detailComment).not.toHaveProperty('isDelete');
    expect(detailComment.replies).toEqual([]);
    expect(detailComment.likeCount).toEqual(0);
  });

  it('should mask content when comment is deleted', () => {
    // Action
    const detailComment = new DetailComment({ ...validPayload, isDelete: true });

    // Assert
    expect(detailComment.content).toEqual('**komentar telah dihapus**');
  });

  it('should throw error when required property is missing', () => {
    expect(() => new DetailComment({ ...validPayload, isDelete: undefined }))
      .toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload is empty', () => {
    expect(() => new DetailComment())
      .toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when replies is not an array', () => {
    expect(() => new DetailComment({ ...validPayload, replies: 'bukan array' }))
      .toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when data type is invalid', () => {
    expect(() => new DetailComment({ ...validPayload, content: 123 }))
      .toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new DetailComment({ ...validPayload, isDelete: 'false' }))
      .toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when likeCount is not a number', () => {
    expect(() => new DetailComment({ ...validPayload, likeCount: '2' }))
      .toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});