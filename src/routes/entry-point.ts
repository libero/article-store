import { constants } from 'http2';
import { Next } from 'koa';
import { addAll } from 'rdf-dataset-ext';
import url from 'url';
import { AppContext, AppMiddleware } from '../app';
import { hydra, rdf, schema } from '../namespaces';
import Routes from './index';

export default (): AppMiddleware => (
  async ({
    dataFactory: { quad, literal, namedNode }, request, response, router,
  }: AppContext, next: Next): Promise<void> => {
    const articleList = namedNode(url.resolve(request.origin, router.url(Routes.ArticleList)));
    const entryPoint = namedNode(url.resolve(request.origin, router.url(Routes.EntryPoint)));

    const quads = [
      quad(entryPoint, rdf.type, schema.EntryPoint),
      quad(entryPoint, schema('name'), literal('Article Store', 'en')),
      quad(entryPoint, hydra.collection, articleList),
      quad(articleList, rdf.type, hydra.Collection),
    ];

    addAll(response.dataset, quads);

    response.status = constants.HTTP_STATUS_OK;

    await next();
  }
);
