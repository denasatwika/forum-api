class AddedThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, owner } = payload;

    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const { id, title, owner } = payload ?? {};

    if (
      id === undefined || id === null ||
            title === undefined || title === null ||
            owner === undefined || owner === null
    ) {
      throw new Error(
        'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
      );
    }

    if (
      [id, title, owner].some(
        (value) => typeof value !== 'string'
      )
    ) {
      throw new Error(
        'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }

    if (
      [id, title, owner].some(
        (value) => value.trim().length === 0
      )
    ) {
      throw new Error(
        'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
      );
    }
  }
}

export default AddedThread;