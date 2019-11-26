import Router from '@koa/router';
import Routes from './routes';
import apiDocumentation from './routes/api-documentation';
import articleList from './routes/article-list';
import entryPoint from './routes/entry-point';

export default (): Router => {
  const router = new Router();

  router.get(Routes.ApiDocumentation, '/doc', apiDocumentation());
  router.get(Routes.ArticleList, '/articles', articleList());
  router.get(Routes.EntryPoint, '/', entryPoint());

  return router;
};
