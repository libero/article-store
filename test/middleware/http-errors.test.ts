import createHttpError from 'http-errors';
import { Context, Response } from 'koa';
import httpErrors from '../../src/middleware/http-errors';
import runMiddleware, { Next } from '../middleware';
import createContext from '../context';

const makeRequest = async (next?: Next): Promise<Response> => {
  const context = createContext();

  return runMiddleware(httpErrors(), context, next);
};

const next = (status?: number, body?: string) => async ({ response }: Context): Promise<void> => {
  if (body) response.body = body;
  if (status) response.status = status;
};

describe('http-errors middleware', (): void => {
  it('should throw if no status has been set', async (): Promise<void> => {
    await expect(makeRequest()).rejects.toThrowError(createHttpError(500));
  });

  it.each([[400], [500]])('should throw if the status is %i and there is no body', async (status: number): Promise<void> => {
    await expect(makeRequest(next(status))).rejects.toThrowError(createHttpError(status));
  });

  it.each([[400], [500]])('should not throw if the status is %i and there is a body', async (status: number): Promise<void> => {
    await expect(makeRequest(next(status, 'some content'))).resolves.not.toThrowError();
  });
});
