import { constants } from 'http2';
import all from 'it-all';
import { Next } from 'koa';
import { addAll } from 'rdf-dataset-ext';
import { BlankNode, DatasetCore } from 'rdf-js';
import { toRdf } from 'rdf-literal';
import url from 'url';
import { AppContext, AppMiddleware } from '../app';
import { hydra, rdf, schema } from '../namespaces';
import Routes from './index';

export default (): AppMiddleware => (
  async ({
    dataFactory: {
      blankNode, quad, literal, namedNode,
    }, articles, request, response, router,
  }: AppContext, next: Next): Promise<void> => {
    const articleList = namedNode(url.resolve(request.origin, router.url(Routes.ArticleList)));
    const manages = blankNode('manages');
    const [list, count] = await Promise.all([all(articles), articles.count()]);

    const quads = [
      quad(articleList, rdf.type, hydra('Collection')),
      quad(articleList, hydra.title, literal('List of articles', 'en')),
      quad(articleList, hydra.manages, manages),
      quad(manages, hydra.property, rdf.type),
      quad(manages, hydra.object, schema.Article),
      quad(articleList, hydra.totalItems, toRdf(count)),
    ];

    list.forEach(([id, article]: [BlankNode, DatasetCore]): void => {
      quads.push(quad(articleList, hydra.member, id), ...article);
    });

    addAll(response.dataset, quads);

    response.status = constants.HTTP_STATUS_OK;

    await next();
  }
);
