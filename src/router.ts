import Router from '@koa/router';
import Routes from './routes';
import apiDocumentation from './routes/api-documentation';
import entryPoint from './routes/entry-point';

export default (): Router => {
  const router = new Router();

  router.get(Routes.ApiDocumentation, '/docs', apiDocumentation(router));
  router.get(Routes.EntryPoint, '/', entryPoint(router));

  return router;
};
