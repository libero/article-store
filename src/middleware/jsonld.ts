import ParserJsonld from '@rdfjs/parser-jsonld';
import SerializerJsonld from '@rdfjs/serializer-jsonld-ext';
import { format as formatContentType } from 'content-type';
import { constants } from 'http2';
import { Context } from 'jsonld/jsonld-spec';
import {
  DefaultState, Middleware, Next, Response,
} from 'koa';
import pEvent from 'p-event';
import { fromStream, toStream } from 'rdf-dataset-ext';
import { Sink } from 'rdf-js';
import { DatasetContext, WithDataset } from './dataset';

const createParser = (): Sink => (
  new ParserJsonld()
);

const createSerializer = (context: Context): Sink => (
  new SerializerJsonld({ compact: true, context })
);

const responseHasContent = (response: WithDataset<Response>): boolean => (
  response.body || response.status === constants.HTTP_STATUS_NO_CONTENT || !response.dataset.size
);

export default (context: Context = {}): Middleware<DefaultState, DatasetContext> => (
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
