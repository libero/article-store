import cors from '@koa/cors';
import Koa from 'koa';
import logger from 'koa-logger';
import { DataFactory, Store as N3Store } from 'n3';
import { Store } from 'rdf-js';
import apiDocumentation from './middleware/api-documentation';
import errorHandler from './middleware/error-handler';
import jsonld from './middleware/jsonld';
import routing from './middleware/routing';
import createRouter from './router';

const app = new Koa();
const articles: Store = new N3Store();
const router = createRouter(articles, DataFactory);

app.use(logger());
app.use(cors({
  exposeHeaders: ['Link'],
}));
app.use(jsonld());
app.use(apiDocumentation(router));
app.use(errorHandler(DataFactory));
app.use(routing(router));

export default app;
