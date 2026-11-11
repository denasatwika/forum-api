import CommentsHandler from './handler.js';
import createCommentsRouter from './routes.js';

export default (container, authenticate) => {
  const commentsHandler = new CommentsHandler(container);
  return createCommentsRouter(commentsHandler, authenticate);
};