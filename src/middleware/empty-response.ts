import {
  DefaultStateExtends, ExtendableContext, Middleware, Next, Response,
} from 'koa';

const makeResponseEmpty = (response: Response): void => {
  response.body = '';
  response.remove('Content-Length');
  response.remove('Content-Type');
};

export default (): Middleware<DefaultStateExtends, ExtendableContext> => (
  async ({ response }: ExtendableContext, next: Next): Promise<void> => {
    await next();

    if (response.body === undefined) {
      makeResponseEmpty(response);
    }
  }
);
