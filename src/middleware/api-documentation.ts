import Router from '@koa/router';
import Link from 'http-link-header';
import { Context, Middleware, Next } from 'koa';
import { hydra } from 'rdf-namespaces';
import Routes from '../routes';

export default (router: Router): Middleware => (
  async ({ response }: Context, next: Next): Promise<void> => {
    await next();

    const link = new Link().set({
      rel: hydra.apiDocumentation,
      uri: router.url(Routes.ApiDocumentation, {}),
    });

    response.append('Link', link.toString());
  }
);
