import Router from '@koa/router';
import { DataFactory, Store } from 'rdf-js';
import Routes from './routes';
import apiDocumentation from './routes/api-documentation';
import articleList from './routes/article-list';
import entryPoint from './routes/entry-point';

export default (articles: Store, dataFactory: DataFactory): Router => {
  const router = new Router();

  router.get(Routes.ApiDocumentation, '/doc', apiDocumentation(router, dataFactory));
  router.get(Routes.ArticleList, '/articles', articleList(articles, router, dataFactory));
  router.get(Routes.EntryPoint, '/', entryPoint(router, dataFactory));

  return router;
};
