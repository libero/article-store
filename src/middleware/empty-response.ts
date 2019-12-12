import { Context, Middleware, Next } from 'koa';

export default (): Middleware => (
  async ({ response }: Context, next: Next): Promise<void> => {
    await next();

    if (response.body !== undefined) {
      return;
    }

    response.body = '';
    response.remove('Content-Length');
    response.remove('Content-Type');
    response.remove('Transfer-Encoding');
  }
);
