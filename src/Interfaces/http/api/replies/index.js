import RepliesHandler from './handler.js';
import createRepliesRouter from './routes.js';

export default (container, authenticate) => {
  const repliesHandler = new RepliesHandler(container);
  return createRepliesRouter(repliesHandler, authenticate);
};