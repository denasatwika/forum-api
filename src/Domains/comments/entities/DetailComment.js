class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, isDelete, replies,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDelete ? '**komentar telah dihapus**' : content;
    this.replies = replies;
  }

  _verifyPayload(payload) {
    const {
      id, username, date, content, isDelete, replies
    } = payload ?? {};
    const stringValues = [id, username, date, content];

    if ([...stringValues, isDelete, replies].some((value) => value === undefined || value === null)) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      stringValues.some((value) => typeof value !== 'string')
      || typeof isDelete !== 'boolean'
      || !Array.isArray(replies)
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default DetailComment;