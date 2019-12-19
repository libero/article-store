import ParserJsonld from '@rdfjs/parser-jsonld';
import SerializerJsonld from '@rdfjs/serializer-jsonld-ext';
import { format as formatContentType } from 'content-type';
import { constants } from 'http2';
import {
  DefaultState, Middleware, Next, Response,
} from 'koa';
import pEvent from 'p-event';
import { fromStream, toStream } from 'rdf-dataset-ext';
import { DatasetCore, Sink } from 'rdf-js';
import { DatasetContext } from './dataset';

const createParser = (): Sink => (
  new ParserJsonld()
);

const createSerializer = (context: object): Sink => (
  new SerializerJsonld({ compact: true, context })
);

const responseHasContent = (response: Response & { dataset: DatasetCore }): boolean => (
  response.body || response.status === constants.HTTP_STATUS_NO_CONTENT || !response.dataset.size
);

export default (context: object = {}): Middleware<DefaultState, DatasetContext> => (
  async (
    { request, response }: DatasetContext, next: Next,
  ): Promise<void> => {
    if (request.is('jsonld')) {
      request.dataset = await fromStream(request.dataset, createParser().import(request.req));
    }

    await next();

    if (responseHasContent(response)) {
      return;
    }

    const contentType = {
      type: 'application/ld+json',
      parameters: { profile: 'http://www.w3.org/ns/json-ld#compacted' },
    };

    response.body = await pEvent(createSerializer(context).import(toStream(response.dataset)), 'data');
    response.set('Content-Type', formatContentType(contentType));
  }
);
