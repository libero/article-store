import Koa from 'koa';
import logger from 'koa-logger';
import createRouter from './router';

const app = new Koa();
const router = createRouter();

app.use(logger());
app.use(router.routes());
app.use(router.allowedMethods({ throw: true }));

export default app;
