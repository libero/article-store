import Router from '@koa/router';
import dataFactory from '@rdfjs/data-model';
import datasetFactory from '@rdfjs/dataset';
import { UnknownError } from 'http-errors';
import Koa, { Context } from 'koa';
import Request from 'koa/lib/request';
import Response from 'koa/lib/response';
import { Request as IncomingMessage, Response as ServerResponse } from 'mock-http';
import { DatasetCore } from 'rdf-js';
import InMemoryArticles from '../src/adaptors/in-memory-articles';
import { AppContext } from '../src/app';
import Articles from '../src/articles';

export type ErrorListener = (error: UnknownError, context: Context) => void;

type Options = {
  articles?: Articles;
  body?: string;
  dataset?: DatasetCore;
  errorListener?: ErrorListener;
  headers?: Record<string, string>;
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
  articles = new InMemoryArticles(), body, dataset = datasetFactory.dataset(), errorListener, headers = {}, method, path, router = dummyRouter,
}: Options = {}): AppContext => {
  const app = new Koa();
  app.on('error', errorListener || jest.fn());

  if (body) {
    headers['content-length'] = String(body.length);
  }

  const request = Object.create(Request);
  const response = Object.create(Response);
  request.app = app;
  request.dataset = dataset;
  request.req = new IncomingMessage({
    buffer: body ? Buffer.from(body) : null,
    headers: { ...headers, host: 'example.com' },
    method,
  });
  response.req = request.req;
  response.res = new ServerResponse();
  response.dataset = datasetFactory.dataset();

  return {
    app, articles, dataFactory, datasetFactory, method, path, request, response, router,
  } as unknown as AppContext;
};
