import Koa, { Context } from 'koa';
import { constants as statusCodes } from 'http2';

const app = new Koa();

app.use(async ({ response }: Context): Promise<void> => {
  response.status = statusCodes.HTTP_STATUS_OK;
});

export default app;
