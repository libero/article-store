import cors from '@koa/cors';
import Koa from 'koa';
import logger from 'koa-logger';
import apiDocumentation from './middleware/api-documentation';
import errorHandler from './middleware/error-handler';
import jsonld from './middleware/jsonld';
import routing from './middleware/routing';
import createRouter from './router';

const app = new Koa();
const router = createRouter();

app.use(logger());
app.use(cors({
  exposeHeaders: ['Link'],
}));
app.use(jsonld({
  '@language': 'en',
  '@vocab': 'http://schema.org/',
  hydra: 'http://www.w3.org/ns/hydra/core#',
}));
app.use(apiDocumentation(router));
app.use(errorHandler());
app.use(routing(router));

export default app;
