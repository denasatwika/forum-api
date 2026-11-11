class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, threadId, owner } = payload;

    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const { content, threadId, owner } = payload ?? {};
    const values = [content, threadId, owner];

    if (values.some((value) => value === undefined || value === null)) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (values.some((value) => typeof value !== 'string')) {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (values.some((value) => value.trim().length === 0)) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

export default NewComment;