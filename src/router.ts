import Router from '@koa/router';
import Routes from './routes';
import addArticle from './routes/add-article';
import apiDocumentation from './routes/api-documentation';
import articleList from './routes/article-list';
import entryPoint from './routes/entry-point';
import { AppContext, AppState } from './types';

export default (): Router<AppState, AppContext> => {
  const router = new Router<AppState, AppContext>();

  router.get(Routes.ApiDocumentation, '/doc', apiDocumentation());
  router.get(Routes.ArticleList, '/articles', articleList());
  router.post(Routes.AddArticle, '/articles', addArticle());
  router.get(Routes.EntryPoint, '/', entryPoint());

  return router;
};
