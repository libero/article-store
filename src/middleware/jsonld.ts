import ParserJsonld from '@rdfjs/parser-jsonld';
import SerializerJsonld from '@rdfjs/serializer-jsonld-ext';
import { format as formatContentType } from 'content-type';
import { NO_CONTENT } from 'http-status-codes';
import type { Context } from 'jsonld/jsonld-spec';
import type { Next, Response } from 'koa';
import type { Middleware } from 'koa-compose';
import pEvent from 'p-event';
import { fromStream, toStream } from 'rdf-dataset-ext';
import type { DatasetContext } from './dataset';

const responseHasContent = (response: Response): boolean => response.body || response.status === NO_CONTENT;

export default (context: Context = {}): Middleware<DatasetContext> => {
  const contentType = {
    type: 'application/ld+json',
    parameters: { profile: 'http://www.w3.org/ns/json-ld#compacted' },
  };
  const parser = new ParserJsonld();
  const serializer = new SerializerJsonld({ compact: true, context });

  return async ({ request, response }: DatasetContext, next: Next): Promise<void> => {
    if (request.is('jsonld')) {
      await fromStream(request.dataset, parser.import(request.req));
    }

    await next();

    if (responseHasContent(response) || !response.dataset.size) {
      return;
    }

    response.body = await pEvent(serializer.import(toStream(response.dataset)), 'data');
    response.set('Content-Type', formatContentType(contentType));
  };
};
