import Router from '@koa/router';
import formatLinkHeader from 'format-link-header';
import { Context, Middleware, Next } from 'koa';
import { hydra } from 'rdf-namespaces';
import url from 'url';
import Routes from '../routes';

export default (router: Router): Middleware => (
  async ({ request, response }: Context, next: Next): Promise<void> => {
    await next();

    const link = {
      rel: hydra.apiDocumentation,
      url: url.resolve(request.origin, router.url(Routes.ApiDocumentation)),
    };

    response.append('Link', formatLinkHeader({ hydra: link }));
  }
);
