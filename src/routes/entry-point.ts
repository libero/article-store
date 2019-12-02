import { DefaultState, Middleware, Next } from 'koa';
import { hydra, schema } from 'rdf-namespaces';
import AppContext from '../context';
import Routes from './index';

export default (): Middleware<DefaultState, AppContext> => (
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
