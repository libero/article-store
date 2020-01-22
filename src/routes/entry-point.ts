import clownface, { Clownface } from 'clownface';
import { OK } from 'http-status-codes';
import { Next } from 'koa';
import { NamedNode } from 'rdf-js';
import url from 'url';
import { AppContext, AppMiddleware } from '../app';
import { hydra, rdf, schema } from '../namespaces';
import Routes from './index';

export default (): AppMiddleware => (
  async ({
    dataFactory: { literal, namedNode }, request, response, router,
  }: AppContext, next: Next): Promise<void> => {
    const createNamedNode = (route: Routes): NamedNode => namedNode(url.resolve(request.origin, router.url(route)));

    const graph = clownface({
      dataset: response.dataset,
      term: createNamedNode(Routes.EntryPoint),
    });

    graph.addOut(rdf.type, schema.EntryPoint);
    graph.addOut(schema('name'), literal('Article Store', 'en'));
    graph.addOut(hydra.collection, createNamedNode(Routes.ArticleList), (list: Clownface): void => {
      list.addOut(rdf.type, hydra.Collection);
    });

    response.status = OK;

    await next();
  }
);
