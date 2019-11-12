import Router from '@koa/router';
import Routes from './routes';
import entryPoint from './routes/entry-point';

export default (): Router => {
  const router = new Router();

  router.get(Routes.EntryPoint, '/', entryPoint(router));

  return router;
};
