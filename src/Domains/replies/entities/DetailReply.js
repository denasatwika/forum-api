class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, username, isDelete,
    } = payload;

    this.id = id;
    this.content = isDelete ? '**balasan telah dihapus**' : content;
    this.date = date;
    this.username = username;
  }

  _verifyPayload(payload) {
    const {
      id, content, date, username, isDelete,
    } = payload ?? {};
    const stringValues = [id, content, date, username];

    if ([...stringValues, isDelete].some((value) => value === undefined || value === null)) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (stringValues.some((value) => typeof value !== 'string') || typeof isDelete !== 'boolean') {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default DetailReply;