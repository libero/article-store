import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import Articles from './articles';
import apiDocumentationLink from './middleware/api-documentation-link';
import errorHandler from './middleware/error-handler';
import routing from './middleware/routing';
import createRouter from './router';

export default (articles: Articles): Koa => {
  const app = new Koa();
  const router = createRouter(articles);

  app.use(logger());
  app.use(bodyParser({
    extendTypes: {
      json: ['application/ld+json'],
    },
  }));
  app.use(cors({
    exposeHeaders: ['Link'],
  }));
  app.use(apiDocumentationLink(router));
  app.use(errorHandler());
  app.use(routing(router));

  return app;
};
