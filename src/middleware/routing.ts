import Router, { RouterContext } from '@koa/router';
import createHttpError from 'http-errors';
import {
  DefaultContextExtends, DefaultStateExtends, Middleware, Next,
} from 'koa';
import compose from 'koa-compose';

const notFound = <State extends DefaultStateExtends, Context extends DefaultContextExtends>
  (): Middleware<State, RouterContext<State, Context>> => (
    async ({ _matchedRoute }: RouterContext<State, Context>, next: Next): Promise<void> => {
      await next();

      if (typeof _matchedRoute === 'undefined') {
        throw new createHttpError.NotFound();
      }
    }
  );

export default <State extends DefaultStateExtends, Context extends DefaultContextExtends>
(router: Router<State, Context>): Middleware<State, RouterContext<State, Context>> => (
  compose([
    router.routes(),
    notFound<State, Context>(),
    router.allowedMethods({ throw: true }),
  ])
);
