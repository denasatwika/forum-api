import express from 'express';
import ClientError from '../../Commons/exceptions/ClientError.js';
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator.js';
import users from '../../Interfaces/http/api/users/index.js';
import authentications from '../../Interfaces/http/api/authentications/index.js';
import threads from '../../Interfaces/http/api/threads/index.js';
import authenticate from './../../Interfaces/http/middlewares/authenticate.js';
import comments from '../../Interfaces/http/api/comments/index.js';
import replies from '../../Interfaces/http/api/replies/index.js';
import likes from '../../Interfaces/http/api/likes/index.js';

const createServer = async (container) => {
  const app = express();

  // Middleware for parsing JSON
  app.use(express.json());

  // Register routes
  app.use('/users', users(container));
  app.use('/authentications', authentications(container));

  const authenticationMiddleware = authenticate(container);

  app.use(
    '/threads',
    threads(container, authenticationMiddleware));

  app.use(
    '/threads/:threadId/comments',
    comments(container, authenticationMiddleware),
  );

  app.use(
    '/threads/:threadId/comments/:commentId/replies',
    replies(container, authenticationMiddleware),
  );

  app.use(
    '/threads/:threadId/comments/:commentId/likes',
    likes(container, authenticationMiddleware),
  );

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      status: 'fail',
      message: 'Route not found',
    });
  });

  // Express mengenali error handler dari jumlah parameternya,
  // next wajib ada walaupun tidak dipakai.
  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    // bila response tersebut error, tangani sesuai kebutuhan
    const translatedError = DomainErrorTranslator.translate(error);

    // penanganan client error secara internal.
    if (translatedError instanceof ClientError) {
      return res.status(translatedError.statusCode).json({
        status: 'fail',
        message: translatedError.message,
      });
    }

    // penanganan server error sesuai kebutuhan
    return res.status(500).json({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    });
  });

  return app;
};

export default createServer;
