class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, isDelete, replies, likeCount,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDelete ? '**komentar telah dihapus**' : content;
    this.replies = replies;
    this.likeCount = likeCount;
  }

  _verifyPayload(payload) {
    const {
      id, username, date, content, isDelete, replies, likeCount,
    } = payload ?? {};
    const stringValues = [id, username, date, content];

    if ([...stringValues, isDelete, replies, likeCount].some((value) => value === undefined || value === null)) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      stringValues.some((value) => typeof value !== 'string')
      || typeof isDelete !== 'boolean'
      || !Array.isArray(replies)
      || typeof likeCount !== 'number'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default DetailComment;