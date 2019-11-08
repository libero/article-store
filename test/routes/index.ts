import Router, { RouterContext } from '@koa/router';
import Koa from 'koa';
import Request from 'koa/lib/request';
import Response from 'koa/lib/response';
import { Request as IncomingMessage, Response as ServerResponse } from 'mock-http';

// eslint-disable-next-line import/prefer-default-export
export const createContext = (route: string): RouterContext => {
  const request = Object.create(Request);
  const response = Object.create(Response);
  request.app = new Koa();
  request.req = new IncomingMessage({ headers: { host: 'example.com' } });
  response.req = request.req;
  response.res = new ServerResponse();

  const router = new Router();
  router.get(route, `path-to/${route}`, jest.fn());

  return { request, response, router } as RouterContext;
};
