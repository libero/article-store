import cors from '@koa/cors';
import Koa from 'koa';
import logger from 'koa-logger';
import errorHandler from './middleware/error-handler';
import routing from './middleware/routing';
import createRouter from './router';

const app = new Koa();
const router = createRouter();

app.use(logger());
app.use(cors());
app.use(errorHandler());
app.use(routing(router));

export default app;
