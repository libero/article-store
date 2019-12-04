import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import Koa from 'koa';
import logger from 'koa-logger';
import InMemoryArticles from './adaptors/in-memory-articles';
import Articles from './articles';
import apiDocumentation from './middleware/api-documentation';
import errorHandler from './middleware/error-handler';
import routing from './middleware/routing';
import createRouter from './router';

const app = new Koa();
const articles: Articles = new InMemoryArticles();
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
app.use(apiDocumentation(router));
app.use(errorHandler());
app.use(routing(router));

export default app;
