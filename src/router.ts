import Router from '@koa/router';
import Articles from './articles';
import Routes from './routes';
import apiDocumentation from './routes/api-documentation';
import articleList from './routes/article-list';
import addArticle from './routes/add-article';
import entryPoint from './routes/entry-point';

export default (articles: Articles): Router => {
  const router = new Router();

  router.get(Routes.ApiDocumentation, '/doc', apiDocumentation(router));
  router.get(Routes.ArticleList, '/articles', articleList(articles, router));
  router.post(Routes.AddArticle, '/articles', addArticle(articles));
  router.get(Routes.EntryPoint, '/', entryPoint(router));

  return router;
};
