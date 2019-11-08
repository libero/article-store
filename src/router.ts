import Router from '@koa/router';
import http from 'http2';
import { Context } from 'koa';
import Routes from './routes';

export default (): Router => {
  const router = new Router();

  router.get(Routes.EntryPoint, '/', async ({ response }: Context): Promise<void> => {
    response.status = http.constants.HTTP_STATUS_OK;
  });

  return router;
};
