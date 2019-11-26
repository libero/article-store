import cors from '@koa/cors';
import Koa from 'koa';
import logger from 'koa-logger';
import apiDocumentation from './middleware/api-documentation';
import errorHandler from './middleware/error-handler';
import routing from './middleware/routing';
import createRouter from './router';

const app = new Koa();

app.use(logger());
app.use(cors({
  exposeHeaders: ['Link'],
}));
app.use(errorHandler());
app.use(routing(createRouter()));
app.use(apiDocumentation());

export default app;
