class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, commentId, owner } = payload;

    this.content = content;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const { content, commentId, owner } = payload ?? {};
    const values = [content, commentId, owner];

    if (values.some((value) => value === undefined || value === null)) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (values.some((value) => typeof value !== 'string')) {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (values.some((value) => value.trim().length === 0)) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

export default NewReply;