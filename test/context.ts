import Router from '@koa/router';
import { UnknownError } from 'http-errors';
import Koa, { Context, Request, Response } from 'koa';
import { Request as IncomingMessage, Response as ServerResponse } from 'mock-http';
import { DatasetCore } from 'rdf-js';
import InMemoryArticles from '../src/adaptors/in-memory-articles';
import { AppContext } from '../src/app';
import Articles from '../src/articles';
import dataFactory, { dataset } from '../src/data-factory';
import { WithDataset } from '../src/middleware/dataset';

export type ErrorListener = (error: UnknownError, context: Context) => void;

export type Headers = Record<string, string>;

type Options = {
  articles?: Articles;
  body?: string;
  dataset?: DatasetCore;
  errorListener?: ErrorListener;
  headers?: Headers;
  method?: string;
  path?: string;
  router?: Router;
};

const dummyRouter = {
  url(name: string): string {
    return `/path-to/${name}`;
  },
} as unknown as Router;

export default ({
  articles = new InMemoryArticles(),
  body,
  dataset: requestDataset = dataset(),
  errorListener,
  headers = {},
  method,
  path,
  router = dummyRouter,
}: Options = {}): AppContext => {
  const app = new Koa();
  app.on('error', errorListener || jest.fn());

  const request = Object.create(app.request) as WithDataset<Request>;
  request.app = app;
  request.dataset = requestDataset;
  request.req = new IncomingMessage({
    buffer: body ? Buffer.from(body) : null,
    headers: {
      ...headers,
      'content-length': typeof body === 'string' ? String(body.length) : undefined,
      host: 'example.com',
    },
    method,
  });

  const response = Object.create(app.response) as WithDataset<Response>;
  response.req = request.req;
  response.res = new ServerResponse();
  response.dataset = dataset();

  return {
    app, articles, dataFactory, method, path, request, response, router,
  } as unknown as AppContext;
};
