import Router from '@koa/router';
import { DataFactory } from 'rdf-js';
import Routes from './routes';
import apiDocumentation from './routes/api-documentation';
import articleList from './routes/article-list';
import entryPoint from './routes/entry-point';

export default (dataFactory: DataFactory): Router => {
  const router = new Router();

  router.get(Routes.ApiDocumentation, '/doc', apiDocumentation(router, dataFactory));
  router.get(Routes.ArticleList, '/articles', articleList(router, dataFactory));
  router.get(Routes.EntryPoint, '/', entryPoint(router, dataFactory));

  return router;
};
