import formatLinkHeader from 'format-link-header';
import type {
  DefaultStateExtends, ExtendableContext, Middleware, Next,
} from 'koa';
import url from 'url';

export default (path: string): Middleware<DefaultStateExtends, ExtendableContext> => (
  async ({ request, response }: ExtendableContext, next: Next): Promise<void> => {
    await next();

    const link = {
      rel: 'http://www.w3.org/ns/hydra/core#apiDocumentation',
      url: url.resolve(request.origin, path),
    };

    response.append('Link', formatLinkHeader({ hydra: link }));
  }
);
