import Router, { RouterContext } from '@koa/router';
import createHttpError from 'http-errors';
import { OK } from 'http-status-codes';
import { Context, Next, Response } from 'koa';
import routing from '../../src/middleware/routing';
import { createRouterContext } from '../context';
import runMiddleware, { NextMiddleware } from '../middleware';

const createRouter = (): Router => {
  const router = new Router();

  router.delete('/', async ({ response }: Context, next: Next): Promise<void> => {
    response.status = OK;

    await next();
  });

  return router;
};

const makeRequest = async (method: string, path: string, next?: NextMiddleware<RouterContext>): Promise<Response> => {
  const router = createRouter();
  const context = createRouterContext({ method, path, router });

  return runMiddleware(routing(context.router), context, next);
};

describe('routing middleware', (): void => {
  it('should match the method and path', async (): Promise<void> => {
    const response = await makeRequest('DELETE', '/');

    expect(response.status).toBe(OK);
  });

  describe('should throw an error', (): void => {
    it('if the path is not found', async (): Promise<void> => {
      await expect(makeRequest('GET', '/does-not-exist')).rejects.toThrowError(new createHttpError.NotFound());
    });

    it('if the method does not match', async (): Promise<void> => {
      await expect(makeRequest('GET', '/')).rejects.toThrowError(new createHttpError.MethodNotAllowed());
    });
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest('DELETE', '/', next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
