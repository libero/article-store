import Router from '@koa/router';
import { Context, Middleware, Next } from 'koa';
import { hydra, rdf, schema } from 'rdf-namespaces';
import Routes from './index';
import { Nodes } from '../nodes';

export default (articles: Nodes, router: Router): Middleware => (
  async ({ request, response }: Context, next: Next): Promise<void> => {
    response.body = {
      '@context': {
        '@base': request.origin,
      },
      '@id': router.url(Routes.ArticleList),
      '@type': hydra.Collection,
      [hydra.title]: { '@value': 'List of articles', '@language': 'en' },
      'http://www.w3.org/ns/hydra/core#manages': {
        'http://www.w3.org/ns/hydra/core#property': rdf.type,
        'http://www.w3.org/ns/hydra/core#object': schema.Article,
      },
      [hydra.totalItems]: [...articles.all()].length,
      [hydra.member]: { '@list': articles.all() },
    };
    response.type = 'jsonld';

    await next();
  }
);
