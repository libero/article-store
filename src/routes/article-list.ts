import { constants } from 'http2';
import { Next } from 'koa';
import { addAll } from 'rdf-dataset-ext';
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

    const quads = [
      quad(articleList, rdf.type, hydra('Collection')),
      quad(articleList, hydra.title, literal('List of articles', 'en')),
      quad(articleList, hydra.manages, manages),
      quad(manages, hydra.property, rdf.type),
      quad(manages, hydra.object, schema.Article),
      quad(articleList, hydra.totalItems, toRdf(await articles.count())),
    ];

    for (const [id, article] of articles) {
      quads.push(quad(articleList, hydra.member, id), ...article);
    }

    addAll(response.dataset, quads);

    response.status = constants.HTTP_STATUS_OK;

    await next();
  }
);
