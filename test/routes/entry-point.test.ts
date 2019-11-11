import jsonld from 'jsonld';
import entryPoint from '../../src/routes/entry-point';
import createContext from './context';

describe('entry-point', (): void => {
  it('should return the entry point', async (): Promise<void> => {
    const context = createContext('entry-point');
    const next = jest.fn();

    await entryPoint(context.router)(context, next);

    const { response } = context;

    expect(response.status).toBe(200);
    expect(response.type).toBe('application/ld+json');

    const graph = await jsonld.expand(response.body);

    expect(graph).toHaveLength(1);

    const object = graph[0];

    expect(object['@id']).toBe('http://example.com/path-to/entry-point');
    expect(object['@type']).toContain('http://schema.org/EntryPoint');
    expect(object).toHaveProperty(['http://schema.org/name']);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
