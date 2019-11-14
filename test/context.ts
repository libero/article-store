import Router, { RouterContext } from '@koa/router';
import Koa from 'koa';
import Request from 'koa/lib/request';
import Response from 'koa/lib/response';
import { Request as IncomingMessage, Response as ServerResponse } from 'mock-http';

type Options = {
  method?: string;
  path?: string;
  router?: Router;
};

const dummyRouter = {
  url(name: string): string {
    return `/path-to/${name}`;
  },
} as unknown as Router;

export default ({ method, path, router = dummyRouter }: Options = {}): RouterContext => {
  const request = Object.create(Request);
  const response = Object.create(Response);
  request.app = new Koa();
  request.req = new IncomingMessage({ headers: { host: 'example.com' } });
  response.req = request.req;
  response.res = new ServerResponse();

  return {
    method, path, request, response, router,
  } as RouterContext;
};
