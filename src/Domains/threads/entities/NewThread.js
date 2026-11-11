class NewThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body, owner } = payload;

    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const { title, body, owner } = payload ?? {};
    const values = [title, body, owner];

    if (values.some((value) => value === undefined || value === null)) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (values.some((value) => typeof value !== 'string')) {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (values.some((value) => value.trim().length === 0)) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

export default NewThread;