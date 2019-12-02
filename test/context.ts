import Router from '@koa/router';
import { UnknownError } from 'http-errors';
import Koa, { Context } from 'koa';
import Request from 'koa/lib/request';
import Response from 'koa/lib/response';
import { Request as IncomingMessage, Response as ServerResponse } from 'mock-http';
import InMemoryArticles from '../src/adaptors/in-memory-articles';
import Articles from '../src/articles';
import AppContext from '../src/context';

export type ErrorListener = (error: UnknownError, context: Context) => void;

type Options = {
  articles?: Articles;
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
  articles = new InMemoryArticles(), errorListener, method, path, router = dummyRouter,
}: Options = {}): AppContext => {
  const app = new Koa();
  app.on('error', errorListener || jest.fn());

  const request = Object.create(Request);
  const response = Object.create(Response);
  request.app = app;
  request.req = new IncomingMessage({ headers: { host: 'example.com' } });
  response.req = request.req;
  response.res = new ServerResponse();

  return {
    app, articles, method, path, request, response, router,
  } as AppContext;
};
