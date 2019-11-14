import Router from '@koa/router';
import { Context, Next, Response } from 'koa';
import routing from '../../src/middleware/routing';
import createContext from '../context';
import runMiddleware from '../middleware';

import createHttpError = require('http-errors');

const makeRequest = async (method: string, path: string): Promise<Response> => {
  const router = new Router();
  router.delete('some-route', '/correct-path', async ({ response }: Context, next: Next): Promise<void> => {
    response.body = 'some-route';

    await next();
  });

  const context = createContext({ method, path, router });

  return runMiddleware(routing(context.router), context);
};

describe('routing middleware', (): void => {
  it('should match the method and path', async (): Promise<void> => {
    const response = await makeRequest('DELETE', '/correct-path');

    expect(response.status).toBe(200);
  });

  describe('should throw an error', (): void => {
    it('if the path is not matched', async (): Promise<void> => {
      await expect(makeRequest('GET', '/unknown-path')).rejects.toThrowError(new createHttpError.NotFound());
    });

    it('if the path is matched but the method isn\'t', async (): Promise<void> => {
      await expect(makeRequest('GET', '/correct-path')).rejects.toThrowError(new createHttpError.MethodNotAllowed());
    });
  });
});
