import Koa, {Context} from 'koa';
import {constants as status_codes} from 'http2';

const app = new Koa();

app.use(async ({response}: Context): Promise<void> => {
  response.status = status_codes.HTTP_STATUS_OK;
});

export default app;
