import { Next } from 'koa';
import { hydra, schema } from 'rdf-namespaces';
import { AppContext, AppMiddleware } from '../types';
import Routes from './index';

export default (): AppMiddleware => (
  async ({ request, response, router }: AppContext, next: Next): Promise<void> => {
    response.body = {
      '@context': {
        '@base': request.origin,
      },
      '@id': router.url(Routes.EntryPoint),
      '@type': schema.EntryPoint,
      [schema.name]: { '@value': 'Article Store', '@language': 'en' },
      [hydra.collection]: {
        '@id': router.url(Routes.ArticleList),
        '@type': hydra.Collection,
      },
    };
    response.type = 'jsonld';

    await next();
  }
);
