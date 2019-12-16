import ParserJsonld from '@rdfjs/parser-jsonld';
import SerializerJsonld from '@rdfjs/serializer-jsonld-ext';
import { format as formatContentType } from 'content-type';
import { constants } from 'http2';
import { Next, Response } from 'koa';
import pEvent from 'p-event';
import { fromStream, toStream } from 'rdf-dataset-ext';
import { DatasetCore, Sink } from 'rdf-js';
// eslint-disable-next-line import/no-cycle
import { AppContext, AppMiddleware } from '../app';

const createParser = (): Sink => (
  new ParserJsonld()
);

const createSerializer = (context: object): Sink => (
  new SerializerJsonld({ compact: true, context })
);

const responseHasContent = (response: Response & { dataset: DatasetCore }): boolean => (
  response.body || response.status === constants.HTTP_STATUS_NO_CONTENT || !response.dataset.size
);

export default (context: object = {}): AppMiddleware => (
  async (
    { request, response }: AppContext, next: Next,
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
