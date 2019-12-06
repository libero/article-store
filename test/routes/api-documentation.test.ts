import jsonld from 'jsonld';
import { Next, Response } from 'koa';
import apiDocumentation from '../../src/routes/api-documentation';
import runMiddleware from '../middleware';
import createContext from '../context';

const makeRequest = async (next?: Next): Promise<Response> => (
  runMiddleware(apiDocumentation(), createContext(), next)
);

describe('API documentation', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.status).toBe(200);
    expect(response.type).toBe('application/ld+json');
  });

  it('should return the API documentation', async (): Promise<void> => {
    const response = await makeRequest();
    const graph = await jsonld.expand(response.body);

    expect(graph).toHaveLength(1);

    const object = graph[0];

    expect(object['@id']).toBe('http://example.com/path-to/api-documentation');
    expect(object['@type']).toContain('http://www.w3.org/ns/hydra/core#ApiDocumentation');
    expect(object).toHaveProperty(['http://www.w3.org/ns/hydra/core#entrypoint']);
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
