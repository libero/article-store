import { RouterContext } from '@koa/router';
import { DefaultState, Middleware, Next } from 'koa';
import { hydra, schema } from 'rdf-namespaces';
import Routes from './index';

export default (): Middleware<DefaultState, RouterContext> => (
  async ({ request, response, router }: RouterContext, next: Next): Promise<void> => {
    response.body = {
      '@context': {
        '@base': request.origin,
      },
      '@id': router.url(Routes.EntryPoint),
      '@type': schema.EntryPoint,
      [schema.name]: { '@value': 'Article Store', '@language': 'en' },
      [hydra.collection]: { '@id': router.url(Routes.ArticleList) },
    };
    response.type = 'jsonld';

    await next();
  }
);
