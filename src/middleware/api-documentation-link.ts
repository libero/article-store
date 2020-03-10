import formatLinkHeader from 'format-link-header';
import { ExtendableContext, Next } from 'koa';
import { Middleware } from 'koa-compose';
import url from 'url';

export default (path: string): Middleware<ExtendableContext> => (
  async ({ request, response }: ExtendableContext, next: Next): Promise<void> => {
    await next();

    const link = {
      rel: 'http://www.w3.org/ns/hydra/core#apiDocumentation',
      url: url.resolve(request.origin, path),
    };

    response.append('Link', formatLinkHeader({ hydra: link }));
  }
);
