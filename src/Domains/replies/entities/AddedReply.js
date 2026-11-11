class AddedReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, owner } = payload;

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const { id, content, owner } = payload ?? {};
    const values = [id, content, owner];

    if (values.some((value) => value === undefined || value === null)) {
      throw new Error('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (values.some((value) => typeof value !== 'string')) {
      throw new Error('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default AddedReply;
