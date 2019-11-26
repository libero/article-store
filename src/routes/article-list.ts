import Router from '@koa/router';
import { Context, Middleware, Next } from 'koa';
import { hydra, rdf, schema } from 'rdf-namespaces';
import Routes from './index';

export default (router: Router): Middleware => (
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
      [hydra.totalItems]: 0,
      [hydra.member]: { '@list': [] },
    };
    response.type = 'jsonld';

    await next();
  }
);
