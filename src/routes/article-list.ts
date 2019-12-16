import all from 'async-iterator-all';
import { Next } from 'koa';
import { hydra, rdf, schema } from 'rdf-namespaces';
import { AppContext, AppMiddleware } from '../app';
import Routes from './index';

export default (): AppMiddleware => (
  async ({
    articles, request, response, router,
  }: AppContext, next: Next): Promise<void> => {
    const [list, count] = await Promise.all([all(articles), articles.count()]);
    response.body = {
      '@context': {
        '@base': request.origin,
      },
      '@id': router.url(Routes.ArticleList),
      '@type': hydra.Collection,
      [hydra.title]: { '@value': 'List of articles', '@language': 'en' },
      'http://www.w3.org/ns/hydra/core#manages': {
        'http://www.w3.org/ns/hydra/core#property': { '@id': rdf.type },
        'http://www.w3.org/ns/hydra/core#object': { '@id': schema.Article },
      },
      [hydra.totalItems]: count,
      [hydra.member]: {
        '@list': list,
      },
    };
    response.type = 'jsonld';

    await next();
  }
);
