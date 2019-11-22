import Router from '@koa/router';
import Routes from './routes';
import apiDocumentation from './routes/api-documentation';
import articleList from './routes/article-list';
import entryPoint from './routes/entry-point';
import InMemoryNodes, { Nodes } from './nodes';

export default (): Router => {
  const router = new Router();
  const articles: Nodes = new InMemoryNodes();

  router.get(Routes.ApiDocumentation, '/doc', apiDocumentation(router));
  router.get(Routes.ArticleList, '/articles', articleList(articles, router));
  router.get(Routes.EntryPoint, '/', entryPoint(router));

  return router;
};
