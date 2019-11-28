import cors from '@koa/cors';
import dataFactory from '@rdfjs/data-model';
import Koa from 'koa';
import logger from 'koa-logger';
import apiDocumentation from './middleware/api-documentation';
import errorHandler from './middleware/error-handler';
import jsonld from './middleware/jsonld';
import routing from './middleware/routing';
import createRouter from './router';

const app = new Koa();
const router = createRouter(dataFactory);

app.use(logger());
app.use(cors({
  exposeHeaders: ['Link'],
}));
app.use(jsonld());
app.use(apiDocumentation(router));
app.use(errorHandler(dataFactory));
app.use(routing(router));

export default app;
