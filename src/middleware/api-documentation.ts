import { RouterContext } from '@koa/router';
import formatLinkHeader from 'format-link-header';
import { DefaultState, Middleware, Next } from 'koa';
import { hydra } from 'rdf-namespaces';
import url from 'url';
import Routes from '../routes';

export default (): Middleware<DefaultState, RouterContext> => (
  async ({ request, response, router }: RouterContext, next: Next): Promise<void> => {
    await next();

    const link = {
      rel: hydra.apiDocumentation,
      url: url.resolve(request.origin, router.url(Routes.ApiDocumentation)),
    };

    response.append('Link', formatLinkHeader({ hydra: link }));
  }
);
