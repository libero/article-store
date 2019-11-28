import { JsonLdSerializer } from 'jsonld-streaming-serializer';
import { Context, Middleware, Next } from 'koa';
import isSource from '../is-source';
import { toReadable } from '../stream';

const createSerializer = (): JsonLdSerializer => (
  new JsonLdSerializer({ useNativeTypes: true })
);

export default (): Middleware => (
  async ({ response }: Context, next: Next): Promise<void> => {
    await next();

    if (!isSource(response.body)) {
      return;
    }

    response.body = toReadable(response.body.match()).pipe(createSerializer());
    response.type = 'application/ld+json';
  }
);
