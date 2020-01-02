import formatLinkHeader from 'format-link-header';
import { Context, Middleware, Next } from 'koa';
import url from 'url';

export default (path: string): Middleware => (
  async ({ request, response }: Context, next: Next): Promise<void> => {
    await next();

    const link = {
      rel: 'http://www.w3.org/ns/hydra/core#apiDocumentation',
      url: url.resolve(request.origin, path),
    };

    response.append('Link', formatLinkHeader({ hydra: link }));
  }
);
