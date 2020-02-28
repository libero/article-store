import { hydra, rdf, schema } from '@tpluscode/rdf-ns-builders';
import clownface, { Clownface } from 'clownface';
import { OK } from 'http-status-codes';
import all from 'it-all';
import { Next } from 'koa';
import { addAll } from 'rdf-dataset-ext';
import { DatasetCore, NamedNode } from 'rdf-js';
import { toRdf } from 'rdf-literal';
import url from 'url';
import { AppContext, AppMiddleware } from '../app';
import Routes from './index';

export default (): AppMiddleware => (
  async ({
    dataFactory: { literal, namedNode }, articles, request, response, router,
  }: AppContext, next: Next): Promise<void> => {
    const graph = clownface({
      dataset: response.dataset,
      term: namedNode(url.resolve(request.origin, router.url(Routes.ArticleList))),
    });

    const listPromise = all(articles)
      .then((list): void => {
        list.forEach(([id, article]: [NamedNode, DatasetCore]): void => {
          graph.addOut(hydra.member, id);
          addAll(graph.dataset, article);
        });
      });

    const countPromise = articles.count()
      .then((count): void => {
        graph.addOut(hydra.totalItems, toRdf(count));
      });

    graph.addOut(rdf.type, hydra.Collection);
    graph.addOut(hydra.title, literal('List of articles', 'en'));
    graph.addOut(hydra.manages, (manages: Clownface): void => {
      manages.addOut(hydra.property, rdf.type);
      manages.addOut(hydra.object, schema.Article);
    });

    await Promise.all([listPromise, countPromise]);

    response.status = OK;

    await next();
  }
);
