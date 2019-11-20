import Router, { RouterContext } from '@koa/router';
import createHttpError from 'http-errors';
import { Middleware, Next, DefaultState } from 'koa';
import compose from 'koa-compose';

const notFound = (): Middleware<DefaultState, RouterContext> => (
  async ({ _matchedRoute }: RouterContext, next: Next): Promise<void> => {
    await next();

    if (typeof _matchedRoute === 'undefined') {
      throw new createHttpError.NotFound();
    }
  }
);

export default (router: Router): Middleware<DefaultState, RouterContext> => (
  compose([
    router.routes(),
    notFound(),
    router.allowedMethods({ throw: true }),
  ])
);
