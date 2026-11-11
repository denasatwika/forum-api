/* istanbul ignore file */

import pool from '../src/Infrastructures/database/postgres/pool.js';

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'sebuah thread',
    body = 'sebuah body thread',
    owner = 'user-123',
    date = new Date().toISOString(),

  }) {
    const query = {
      text: `INSERT INTO threads
            (id, title, body, owner, date)
            VALUES($1, $2, $3, $4, $5) RETURNING id`,
      values: [id, title, body, owner, date],
    };

    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE threads CASCADE');
  },
};

export default ThreadsTableTestHelper;