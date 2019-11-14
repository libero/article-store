import { Context, Middleware, Next } from 'koa';

export default (): Middleware => (
  async ({ response, throw: throwError }: Context, next: Next): Promise<void> => {
    await next();

    const { body, status } = response;

    if (typeof status === 'undefined' || (status >= 400 && typeof body === 'undefined')) {
      throwError(status);
    }
  }
);
