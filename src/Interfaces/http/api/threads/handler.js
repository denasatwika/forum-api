import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js';
import GetThreadDetailUseCase from '../../../../Applications/use_case/GetThreadDetailUseCase.js';

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(req, res, next) {
    try {
      const addThreadUseCase = this._container.getInstance(
        AddThreadUseCase.name
      );

      const { title, body } = req.body ?? {};

      const addedThread = await addThreadUseCase.execute({
        title,
        body,
        owner: req.auth.id,
      });

      return res.status(201).json({
        status: 'success',
        data: {
          addedThread,
        },
      });
    } catch (error) {
      next(error);
    }
  }


  async getThreadByIdHandler(req, res, next) {
    try {
      const getThreadDetailUseCase =
      this._container.getInstance(
        GetThreadDetailUseCase.name
      );

      const thread = await getThreadDetailUseCase.execute(
        req.params.threadId
      );

      return res.status(200).json({
        status: 'success',
        data: {
          thread,
        },
      });
    } catch (error) {
      next(error);
    }
  }

}

export default ThreadsHandler;
