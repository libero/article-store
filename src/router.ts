import Router from '@koa/router';
import { Context } from 'koa';
import http from 'http2';

export enum Routes {
  'EntryPoint' = 'entry-point',
}

export default (): Router => {
  const router = new Router();

  router.get(Routes.EntryPoint, '/', async ({ response }: Context): Promise<void> => {
    response.status = http.constants.HTTP_STATUS_OK;
  });

  return router;
};
