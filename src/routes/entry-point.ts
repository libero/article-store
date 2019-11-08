import Router from '@koa/router';
import http from 'http2';
import { Context, Middleware, Next } from 'koa';
import { schema } from 'rdf-namespaces';
import url from 'url';
import Routes from './index';

export default (router: Router): Middleware => (
  async ({ request, response }: Context, next: Next): Promise<void> => {
    response.status = http.constants.HTTP_STATUS_OK;
    response.body = {
      '@id': url.resolve(request.origin, router.url(Routes.EntryPoint, {})),
      '@type': schema.EntryPoint,
      [schema.name]: { '@value': 'Article Store', '@language': 'en' },
    };
    response.type = 'application/ld+json';

    await next();
  }
);
