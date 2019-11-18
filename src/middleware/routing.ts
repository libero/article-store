import Router, { RouterContext } from '@koa/router';
import createHttpError from 'http-errors';
import { Middleware, Next, DefaultContext } from 'koa';
import compose from 'koa-compose';

const notFound = (): Middleware<DefaultContext, RouterContext> => (
  async ({ _matchedRoute }, next: Next): Promise<void> => {
    await next();

    if (typeof _matchedRoute === 'undefined') {
      throw new createHttpError.NotFound();
    }
  }
);

export default (router: Router): Middleware<DefaultContext, RouterContext> => (
  compose([
    router.routes(),
    notFound(),
    router.allowedMethods({ throw: true }),
  ])
);
