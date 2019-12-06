import Router from '@koa/router';
import { Context, Middleware, Next } from 'koa';
import { hydra, rdf, schema } from 'rdf-namespaces';
import Articles from '../articles';
import Routes from './index';

export default (articles: Articles, router: Router): Middleware => (
  async ({ request, response }: Context, next: Next): Promise<void> => {
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
      [hydra.totalItems]: await articles.count(),
      [hydra.member]: {
        '@list': [...articles],
      },
    };
    response.type = 'jsonld';

    await next();
  }
);
