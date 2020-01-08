import { format as formatContentType } from 'content-type';
import jsonld from 'jsonld';
import { Context as JsonLdContext } from 'jsonld/jsonld-spec';
import {
  DefaultStateExtends, ExtendableContext, Middleware, Next, Response,
} from 'koa';

const isJsonLd = (response: Response): boolean => response.is('jsonld') && typeof response.body === 'object';

export default (context: JsonLdContext): Middleware<DefaultStateExtends, ExtendableContext> => (
  async ({ response }: ExtendableContext, next: Next): Promise<void> => {
    await next();

    if (!isJsonLd(response)) {
      return;
    }

    const contentType = {
      type: 'application/ld+json',
      parameters: { profile: 'http://www.w3.org/ns/json-ld#compacted' },
    };

    response.body = await jsonld.compact(response.body, context);
    response.set('Content-Type', formatContentType(contentType));
  }
);
