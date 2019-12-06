import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import Articles from './articles';
import apiDocumentation from './middleware/api-documentation';
import errorHandler from './middleware/error-handler';
import routing from './middleware/routing';
import createRouter from './router';
import Routes from './routes';
import { App, AppContext, AppState } from './types';

export default (articles: Articles): App => {
  const app = new Koa<AppState, AppContext>();
  const router = createRouter();

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
  app.use(apiDocumentation(router.url(Routes.ApiDocumentation)));
  app.use(errorHandler());
  app.use(routing(router));

  return app;
};
