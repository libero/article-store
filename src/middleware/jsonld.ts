import jsonld from 'jsonld';
import { Context as JsonLdContext } from 'jsonld/jsonld-spec';
import {
  Context, Middleware, Next, Response,
} from 'koa';

const isJsonLd = (response: Response): boolean => response.type === 'application/ld+json' && typeof response.body === 'object';

export default (context: JsonLdContext): Middleware => (
  async ({ response }: Context, next: Next): Promise<void> => {
    await next();

    if (!isJsonLd(response)) {
      return;
    }

    response.body = await jsonld.compact(response.body, context);
    response.set('Content-Type', 'application/ld+json; profile=http://www.w3.org/ns/json-ld#compacted');
  }
);
