import Router from '@koa/router';
import { AppContext, AppState } from './app';
import Routes from './routes';
import apiDocumentation from './routes/api-documentation';
import articleList from './routes/article-list';
import entryPoint from './routes/entry-point';

export default (): Router<AppState, AppContext> => {
  const router = new Router<AppState, AppContext>();

  router.get(Routes.ApiDocumentation, '/doc', apiDocumentation());
  router.get(Routes.ArticleList, '/articles', articleList());
  router.get(Routes.EntryPoint, '/', entryPoint());

  return router;
};
