import { Context, Response } from 'koa';
import emptyResponse from '../../src/middleware/empty-response';
import createContext from '../context';
import runMiddleware, { Next } from '../middleware';

const makeRequest = async (next?: Next): Promise<Response> => (
  runMiddleware(emptyResponse(), createContext(), next)
);

describe('Empty response middleware', (): void => {
  it('sets an empty string body if it has not been set', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.body).toBe('');
  });

  it('removes redundant headers if no body has been set', async (): Promise<void> => {
    const next = async ({ response }: Context): Promise<void> => {
      response.set('Content-Length', '100');
      response.set('Content-Type', 'content/type');
    };

    const response = await makeRequest(next);

    expect(response.headers).not.toHaveProperty('content-length');
    expect(response.headers).not.toHaveProperty('content-type');
  });

  it('does nothing if there is a body', async (): Promise<void> => {
    const next = async ({ response }: Context): Promise<void> => {
      response.body = 'body content';
    };

    const response = await makeRequest(next);

    expect(response.body).toBe('body content');
    expect(response.headers).toHaveProperty('content-length');
    expect(response.headers).toHaveProperty('content-type');
  });
});
