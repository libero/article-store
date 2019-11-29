import cors from '@koa/cors';
import Koa from 'koa';
import logger from 'koa-logger';
import InMemoryArticles from './adaptors/in-memory-articles';
import apiDocumentation from './middleware/api-documentation';
import errorHandler from './middleware/error-handler';
import routing from './middleware/routing';
import createRouter from './router';

const app = new Koa();
const router = createRouter(new InMemoryArticles());

app.use(logger());
app.use(cors({
  exposeHeaders: ['Link'],
}));
app.use(apiDocumentation(router));
app.use(errorHandler());
app.use(routing(router));

export default app;
