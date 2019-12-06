import cors from '@koa/cors';
import Router, { RouterContext } from '@koa/router';
import Koa, { DefaultState, Middleware } from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import Articles from './articles';
import apiDocumentation from './middleware/api-documentation';
import errorHandler from './middleware/error-handler';
import routing from './middleware/routing';

export type AppState = DefaultState;

export type AppContext = RouterContext<AppState, {
  articles: Articles;
}>;

export type AppMiddleware = Middleware<AppState, AppContext>;

export default (
  articles: Articles,
  router: Router<AppState, AppContext>,
  apiDocumentationPath: string,
): Koa<AppState, AppContext> => {
  const app = new Koa<AppState, AppContext>();

  app.context.articles = articles;
  app.context.router = router;

  app.use(logger());
  app.use(bodyParser({
    extendTypes: {
      json: ['application/ld+json'],
    },
  }));
  app.use(cors({
    exposeHeaders: ['Link'],
  }));
  app.use(apiDocumentation(apiDocumentationPath));
  app.use(errorHandler());
  app.use(routing(router));

  return app;
};
