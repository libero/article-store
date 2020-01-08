import cors from '@koa/cors';
import Router, { RouterContext } from '@koa/router';
import Koa, { DefaultState, Middleware } from 'koa';
import logger from 'koa-logger';
import Articles from './articles';
import apiDocumentationLink from './middleware/api-documentation-link';
import setDataFactory from './middleware/data-factory';
import addDatasets, { DatasetContext, ExtendedDataFactory } from './middleware/dataset';
import emptyResponse from './middleware/empty-response';
import errorHandler from './middleware/error-handler';
import jsonld from './middleware/jsonld';
import routing from './middleware/routing';
import namespaces from './namespaces';

export type AppState = DefaultState;

export type AppContext = RouterContext<AppState, DatasetContext<{
  articles: Articles;
}>>;

export type AppMiddleware = Middleware<AppState, AppContext>;

export type App = Koa<AppState, AppContext>

export default (
  articles: Articles,
  router: Router<AppState, AppContext>,
  apiDocumentationPath: string,
  dataFactory: ExtendedDataFactory,
): App => {
  const app = new Koa<AppState, AppContext>();

  app.context.articles = articles;
  app.context.router = router;

  app.use(logger());
  app.use(emptyResponse());
  app.use(cors({
    exposeHeaders: ['Link'],
  }));
  app.use(setDataFactory(dataFactory));
  app.use(addDatasets());
  app.use(jsonld({
    '@language': 'en',
    ...namespaces,
  }));
  app.use(apiDocumentationLink(apiDocumentationPath));
  app.use(errorHandler());
  app.use(routing(router));

  return app;
};
