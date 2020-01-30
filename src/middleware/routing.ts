import Router, { Middleware, RouterParamContext } from '@koa/router';
import createHttpError from 'http-errors';
import { DefaultContextExtends, DefaultStateExtends, Next } from 'koa';
import compose from 'koa-compose';

const notFound = <State extends DefaultStateExtends, Context extends DefaultContextExtends>
  (): Middleware<State, Context> => (
    async ({ _matchedRoute }: RouterParamContext<State, Context>, next: Next): Promise<void> => {
      await next();

      if (typeof _matchedRoute === 'undefined') {
        throw new createHttpError.NotFound();
      }
    }
  );

export default <State extends DefaultStateExtends, Context extends DefaultContextExtends>
(router: Router<State, Context>): Middleware<State, Context> => (
  compose([
    router.routes(),
    notFound<State, Context>(),
    router.allowedMethods({ throw: true }),
  ])
);
