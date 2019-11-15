import cors from '@koa/cors';
import Koa from 'koa';
import logger from 'koa-logger';
import apiDocumentation from './middleware/api-documentation';
import routing from './middleware/routing';
import createRouter from './router';

const app = new Koa();
const router = createRouter();

app.use(logger());
app.use(cors({
  exposeHeaders: ['Link'],
}));
app.use(apiDocumentation(router));
app.use(routing(router));

export default app;
