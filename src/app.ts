import cors from '@koa/cors';
import Koa, { DefaultState } from 'koa';
import logger from 'koa-logger';
import InMemoryArticles from './adaptors/in-memory-articles';
import AppContext from './context';
import apiDocumentation from './middleware/api-documentation';
import errorHandler from './middleware/error-handler';
import routing from './middleware/routing';
import createRouter from './router';

const app = new Koa<DefaultState, AppContext>();

app.context.articles = new InMemoryArticles();
app.context.router = createRouter();

app.use(logger());
app.use(cors({
  exposeHeaders: ['Link'],
}));
app.use(apiDocumentation());
app.use(errorHandler());
app.use(routing(app.context.router));

export default app;
