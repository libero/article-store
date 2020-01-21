import Router from '@koa/router';
import { AppServiceContext, AppState } from './app';
import Routes from './routes';
import addArticle from './routes/add-article';
import apiDocumentation from './routes/api-documentation';
import article from './routes/article';
import articleList from './routes/article-list';
import entryPoint from './routes/entry-point';

export default (): Router<AppState, AppServiceContext> => {
  const router = new Router<AppState, AppServiceContext>();

  router.get(Routes.ApiDocumentation, '/doc', apiDocumentation());
  router.get(Routes.ArticleList, '/articles', articleList());
  router.post(Routes.AddArticle, '/articles', addArticle());
  router.get(Routes.EntryPoint, '/', entryPoint());
  router.get(Routes.Article, /(|^$)/, article());

  return router;
};
