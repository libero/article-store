import jsonld from 'jsonld';
import { Response } from 'koa';
import entryPoint from '../../src/routes/entry-point';
import createContext from '../context';
import runMiddleware, { NextMiddleware } from '../middleware';

const makeRequest = async (next?: NextMiddleware): Promise<Response> => (
  runMiddleware(entryPoint(), createContext(), next)
);

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
    expect(object).toHaveProperty(['http://www.w3.org/ns/hydra/core#collection']);
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
