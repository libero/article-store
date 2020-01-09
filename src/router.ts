import Router from '@koa/router';
import { AppRouterContext, AppState } from './app';
import Routes from './routes';
import addArticle from './routes/add-article';
import apiDocumentation from './routes/api-documentation';
import articleList from './routes/article-list';
import entryPoint from './routes/entry-point';

export default (): Router<AppState, AppRouterContext> => {
  const router = new Router<AppState, AppRouterContext>();

  router.get(Routes.ApiDocumentation, '/doc', apiDocumentation());
  router.get(Routes.ArticleList, '/articles', articleList());
  router.post(Routes.AddArticle, '/articles', addArticle());
  router.get(Routes.EntryPoint, '/', entryPoint());

  return router;
};
