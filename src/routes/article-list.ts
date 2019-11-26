import { RouterContext } from '@koa/router';
import { DefaultState, Middleware, Next } from 'koa';
import { hydra, rdf, schema } from 'rdf-namespaces';
import Routes from './index';

export default (): Middleware<DefaultState, RouterContext> => (
  async ({ request, response, router }: RouterContext, next: Next): Promise<void> => {
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
