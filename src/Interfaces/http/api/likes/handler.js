import ToggleLikeCommentUseCase from '../../../../Applications/use_case/ToggleLikeCommentUseCase.js';

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(req, res, next) {
    try {
      const toggleLikeCommentUseCase = this._container.getInstance(ToggleLikeCommentUseCase.name);

      await toggleLikeCommentUseCase.execute({
        threadId: req.params.threadId,
        commentId: req.params.commentId,
        owner: req.auth.id,
      });

      res.json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default LikesHandler;