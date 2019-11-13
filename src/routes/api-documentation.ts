import Router from '@koa/router';
import { Context, Middleware, Next } from 'koa';
import { hydra, owl, schema } from 'rdf-namespaces';
import url from 'url';
import Routes from './index';

export default (router: Router): Middleware => (
  async ({ request, response }: Context, next: Next): Promise<void> => {
    response.body = {
      '@id': url.resolve(request.origin, router.url(Routes.ApiDocumentation, {})),
      '@type': hydra.ApiDocumentation,
      [hydra.entrypoint]: {
        '@id': url.resolve(request.origin, router.url(Routes.EntryPoint, {})),
      },
      [hydra.supportedClass]: [
        {
          '@id': schema.EntryPoint,
          '@type': hydra.Class,
          [hydra.title]: 'API entry point',
          [hydra.supportedOperation]: {
            '@type': hydra.Operation,
            [hydra.title]: 'Get the entry point',
            [hydra.method]: 'GET',
            [hydra.expects]: {
              '@id': owl.Nothing,
            },
            [hydra.returns]: {
              '@id': schema.EntryPoint,
            },
          },
        },
      ],
    };
    response.type = 'jsonld';

    await next();
  }
);
