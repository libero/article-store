import jsonld from 'jsonld';
import { createContext } from '.';
import entryPoint from '../../src/routes/entry-point';

describe('entry-point', (): void => {
  it('should return the entry point', async (): Promise<void> => {
    const context = createContext('entry-point');
    const next = jest.fn();

    await entryPoint(context.router)(context, next);

    const { response } = context;

    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/ld+json');

    const graph = await jsonld.expand(response.body);

    expect(graph).toHaveLength(1);

    const object = graph[0];

    expect(object['@id']).toBe('http://example.com/path-to/entry-point');
    expect(object['@type']).toContain('http://schema.org/EntryPoint');
    expect(object).toHaveProperty(['http://schema.org/name']);

    expect(next).toHaveBeenCalled();
  });
});
