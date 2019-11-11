import jsonld from 'jsonld';
import { Next, Response } from 'koa';
import entryPoint from '../../src/routes/entry-point';
import runMiddleware from '../middleware';
import createContext from './context';

const makeRequest = async (next?: Next): Promise<Response> => {
  const context = createContext('entry-point');

  return runMiddleware(entryPoint(context.router), context, next);
};

describe('entry-point', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.status).toBe(200);
    expect(response.type).toBe('application/ld+json');
  });

  it('should return the entry point', async (): Promise<void> => {
    const response = await makeRequest();
    const graph = await jsonld.expand(response.body);

    expect(graph).toHaveLength(1);

    const object = graph[0];

    expect(object['@id']).toBe('http://example.com/path-to/entry-point');
    expect(object['@type']).toContain('http://schema.org/EntryPoint');
    expect(object).toHaveProperty(['http://schema.org/name']);
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
