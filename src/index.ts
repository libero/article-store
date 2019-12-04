import cors from '@koa/cors';
import Koa from 'koa';
import logger from 'koa-logger';
import InMemoryArticles from './adaptors/in-memory-articles';
import App, { AppContext, AppState } from './app';
import apiDocumentation from './middleware/api-documentation';
import errorHandler from './middleware/error-handler';
import routing from './middleware/routing';
import createRouter from './router';

const app: App = new Koa<AppState, AppContext>();

app.context.articles = new InMemoryArticles();
app.context.router = createRouter();

app.use(logger());
app.use(cors({
  exposeHeaders: ['Link'],
}));
app.use(apiDocumentation());
app.use(errorHandler());
app.use(routing(app.context.router));

export default app.listen(8080);
