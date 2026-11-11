/* istanbul ignore file */

import jwt from 'jsonwebtoken';
import config from '../src/Commons/config.js';
import UsersTableTestHelper from './UsersTableTestHelper.js';

const ServerTestHelper = {
  async getAccessToken({
    id = 'user-123',
    username = 'dicoding'
  } = {}){
    await UsersTableTestHelper.addUser({ id, username });
    return jwt.sign({ id, username }, config.auth.accessTokenKey);
  }

};

export default ServerTestHelper;