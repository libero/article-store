import type { ExtendableContext, Next, Response } from 'koa';
import type { Middleware } from 'koa-compose';

const makeResponseEmpty = (response: Response): void => {
  response.body = '';
  response.remove('Content-Length');
  response.remove('Content-Type');
};

export default (): Middleware<ExtendableContext> => (
  async ({ response }: ExtendableContext, next: Next): Promise<void> => {
    await next();

    if (response.body === undefined) {
      makeResponseEmpty(response);
    }
  }
);
