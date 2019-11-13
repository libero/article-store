import Router from '@koa/router';
import { Context, Middleware, Next } from 'koa';
import { schema } from 'rdf-namespaces';
import Routes from './index';

export default (router: Router): Middleware => (
  async ({ request, response }: Context, next: Next): Promise<void> => {
    response.body = {
      '@context': {
        '@base': request.origin,
      },
      '@id': router.url(Routes.EntryPoint, {}),
      '@type': schema.EntryPoint,
      [schema.name]: { '@value': 'Article Store', '@language': 'en' },
    };
    response.type = 'jsonld';

    await next();
  }
);
