import Router from '@koa/router';
import { UnknownError } from 'http-errors';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import Koa, { Context } from 'koa';
import Request from 'koa/lib/request';
import Response from 'koa/lib/response';
import { Request as IncomingMessage, Response as ServerResponse } from 'mock-http';
import InMemoryArticles from '../src/adaptors/in-memory-articles';
import { AppContext } from '../src/app';
import Articles from '../src/articles';

export type ErrorListener = (error: UnknownError, context: Context) => void;

type Options = {
  articles?: Articles;
  body?: JsonLdObj;
  errorListener?: ErrorListener;
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
  articles = new InMemoryArticles(), body, errorListener, method, path, router = dummyRouter,
}: Options = {}): AppContext => {
  const app = new Koa();
  app.on('error', errorListener || jest.fn());

  const request = Object.create(Request);
  const response = Object.create(Response);
  request.app = app;
  request.body = body;
  request.req = new IncomingMessage({ headers: { host: 'example.com' } });
  response.req = request.req;
  response.res = new ServerResponse();

  return {
    app, articles, method, path, request, response, router,
  } as AppContext;
};
