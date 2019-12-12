import cors from '@koa/cors';
import Router, { RouterContext } from '@koa/router';
import Koa, { DefaultState, Middleware } from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import Articles from './articles';
import apiDocumentationLink from './middleware/api-documentation-link';
import emptyResponse from './middleware/empty-response';
import errorHandler from './middleware/error-handler';
import jsonld from './middleware/jsonld';
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

  app.use(emptyResponse());
  app.use(logger());
  app.use(emptyResponse());
  app.use(bodyParser({
    extendTypes: {
      json: ['application/ld+json'],
    },
  }));
  app.use(cors({
    exposeHeaders: ['Link'],
  }));
  app.use(jsonld({
    '@language': 'en',
    hydra: 'http://www.w3.org/ns/hydra/core#',
    owl: 'http://www.w3.org/2002/07/owl#',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    schema: 'http://schema.org/',
  }));
  app.use(apiDocumentationLink(apiDocumentationPath));
  app.use(errorHandler());
  app.use(routing(router));

  return app;
};
