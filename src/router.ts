import Router from '@koa/router';
import Articles from './articles';
import Routes from './routes';
import apiDocumentation from './routes/api-documentation';
import articleList from './routes/article-list';
import postArticle from './routes/post-article';
import entryPoint from './routes/entry-point';

export default (articles: Articles): Router => {
  const router = new Router();

  router.get(Routes.ApiDocumentation, '/doc', apiDocumentation(router));
  router.get(Routes.ArticleList, '/articles', articleList(articles, router));
  router.post(Routes.PostArticle, '/articles', postArticle(articles));
  router.get(Routes.EntryPoint, '/', entryPoint(router));

  return router;
};
