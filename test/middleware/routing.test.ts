import Router from '@koa/router';
import createHttpError from 'http-errors';
import { Context, Next, Response } from 'koa';
import routing from '../../src/middleware/routing';
import createContext from '../context';
import runMiddleware from '../middleware';

const makeRequest = async (method: string, path: string): Promise<Response> => {
  const router = new Router();
  router.delete('/', async ({ response }: Context, next: Next): Promise<void> => {
    response.status = 200;

    await next();
  });

  const context = createContext({ method, path, router });

  return runMiddleware(routing(context.router), context);
};

describe('routing middleware', (): void => {
  it('should match the method and path', async (): Promise<void> => {
    const response = await makeRequest('DELETE', '/');

    expect(response.status).toBe(200);
  });

  describe('should throw an error', (): void => {
    it('if the path is not found', async (): Promise<void> => {
      await expect(makeRequest('GET', '/does-not-exist')).rejects.toThrowError(new createHttpError.NotFound());
    });

    it('if the method does not match', async (): Promise<void> => {
      await expect(makeRequest('GET', '/')).rejects.toThrowError(new createHttpError.MethodNotAllowed());
    });
  });
});
