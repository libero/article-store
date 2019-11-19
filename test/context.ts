import Router, { RouterContext } from '@koa/router';
import { UnknownError } from 'http-errors';
import Koa, { Context } from 'koa';
import Request from 'koa/lib/request';
import Response from 'koa/lib/response';
import { Request as IncomingMessage, Response as ServerResponse } from 'mock-http';

export type ErrorListener = (error: UnknownError, context: Context) => void;

type Options = {
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
  errorListener, method, path, router = dummyRouter,
}: Options = {}): RouterContext => {
  const app = new Koa();
  app.on('error', errorListener || jest.fn());

  const request = Object.create(Request);
  const response = Object.create(Response);
  request.app = app;
  request.req = new IncomingMessage({ headers: { host: 'example.com' } });
  response.req = request.req;
  response.res = new ServerResponse();

  return {
    app, method, path, request, response, router,
  } as RouterContext;
};
