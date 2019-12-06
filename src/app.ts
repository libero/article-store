import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import Articles from './articles';
import apiDocumentation from './middleware/api-documentation';
import errorHandler from './middleware/error-handler';
import jsonld from './middleware/jsonld';
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
  app.use(jsonld({
    '@language': 'en',
    hydra: 'http://www.w3.org/ns/hydra/core#',
    owl: 'http://www.w3.org/2002/07/owl#',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    schema: 'http://schema.org/',
  }));
  app.use(apiDocumentation(router));
  app.use(errorHandler());
  app.use(routing(router));

  return app;
};
