import {
  Context, Middleware, Next, Response,
} from 'koa';

const makeResponseEmpty = (response: Response): void => {
  response.body = '';
  response.remove('Content-Length');
  response.remove('Content-Type');
};

export default (): Middleware => (
  async ({ response }: Context, next: Next): Promise<void> => {
    await next();

    if (response.body === undefined) {
      makeResponseEmpty(response);
    }
  }
);
