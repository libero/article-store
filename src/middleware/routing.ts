import type Router from '@koa/router';
import createHttpError from 'http-errors';
import type { DefaultContextExtends, DefaultStateExtends, Next } from 'koa';
import compose from 'koa-compose';

const notFound = <State extends DefaultStateExtends, Context extends DefaultContextExtends>
  (): Router.Middleware<State, Context> => (
    async ({ _matchedRoute }: Router.RouterParamContext<State, Context>, next: Next): Promise<void> => {
      await next();

      if (typeof _matchedRoute === 'undefined') {
        throw new createHttpError.NotFound();
      }
    }
  );

export default <State extends DefaultStateExtends, Context extends DefaultContextExtends>
(router: Router<State, Context>): Router.Middleware<State, Context> => (
  compose([
    router.routes(),
    notFound<State, Context>(),
    router.allowedMethods({ throw: true }),
  ])
);
