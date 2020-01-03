import clownface, { Clownface } from 'clownface';
import { constants } from 'http2';
import all from 'it-all';
import { Next } from 'koa';
import { BlankNode, DatasetCore } from 'rdf-js';
import { addAll } from 'rdf-dataset-ext';
import { toRdf } from 'rdf-literal';
import url from 'url';
import { AppContext, AppMiddleware } from '../app';
import { hydra, rdf, schema } from '../namespaces';
import Routes from './index';

export default (): AppMiddleware => (
  async ({
    dataFactory: { literal, namedNode }, articles, request, response, router,
  }: AppContext, next: Next): Promise<void> => {
    const graph = clownface({
      dataset: response.dataset,
      term: namedNode(url.resolve(request.origin, router.url(Routes.ArticleList))),
    });

    const [list, count] = await Promise.all([all(articles), articles.count()]);

    graph.addOut(rdf.type, hydra.Collection);
    graph.addOut(hydra.title, literal('List of articles', 'en'));
    graph.addOut(hydra.manages, (manages: Clownface): void => {
      manages.addOut(hydra.property, rdf.type);
      manages.addOut(hydra.object, schema.Article);
    });
    graph.addOut(hydra.totalItems, toRdf(count));

    list.forEach(([id, article]: [BlankNode, DatasetCore]): void => {
      graph.addOut(hydra.member, id);
      addAll(graph.dataset, article);
    });

    response.status = constants.HTTP_STATUS_OK;

    await next();
  }
);
