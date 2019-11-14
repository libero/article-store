import cors from '@koa/cors';
import Koa from 'koa';
import logger from 'koa-logger';
import httpErrors from './middleware/http-errors';
import createRouter from './router';

const app = new Koa();
const router = createRouter();

app.use(logger());
app.use(cors());
app.use(httpErrors());
app.use(router.routes());
app.use(router.allowedMethods({ throw: true }));

export default app;
