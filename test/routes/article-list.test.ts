import jsonld from 'jsonld';
import { Next, Response } from 'koa';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import Articles from '../../src/articles';
import articleList from '../../src/routes/article-list';
import createContext from '../context';
import runMiddleware from '../middleware';

const makeRequest = async (
  next?: Next,
  articles: Articles = new InMemoryArticles(),
): Promise<Response> => {
  const context = createContext();

  return runMiddleware(articleList(articles, context.router), context, next);
};

describe('article list', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.status).toBe(200);
    expect(response.type).toBe('application/ld+json');
  });

  it('should return an empty list', async (): Promise<void> => {
    const response = await makeRequest();
    const graph = await jsonld.expand(response.body);

    expect(graph).toHaveLength(1);

    const object = graph[0];

    expect(object['@id']).toBe('http://example.com/path-to/article-list');
    expect(object['@type']).toContain('http://www.w3.org/ns/hydra/core#Collection');
    expect(object).toHaveProperty(['http://www.w3.org/ns/hydra/core#title']);
    expect(object).toHaveProperty(['http://www.w3.org/ns/hydra/core#manages']);
    expect(object).toHaveProperty(['http://www.w3.org/ns/hydra/core#totalItems']);
    expect(object['http://www.w3.org/ns/hydra/core#totalItems'][0]['@value']).toEqual(0);
    expect(object).toHaveProperty(['http://www.w3.org/ns/hydra/core#member']);
    expect(object['http://www.w3.org/ns/hydra/core#member'][0]['@list']).toHaveLength(0);
  });

  it('should return the list', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    await articles.add({
      '@type': 'http://schema.org/Article',
      '@id': '_:09560',
      'http://schema.org/name': 'Homo naledi, a new species of the genus Homo from the Dinaledi Chamber, South Africa',
    });
    await articles.add({
      '@type': 'http://schema.org/Article',
      '@id': '_:24231',
      'http://schema.org/name': 'The age of Homo naledi and associated sediments in the Rising Star Cave, South Africa',
    });

    const response = await makeRequest(undefined, articles);
    const graph = await jsonld.expand(response.body);

    expect(graph).toHaveLength(1);

    const object = graph[0];

    expect(object['@id']).toBe('http://example.com/path-to/article-list');
    expect(object['@type']).toContain('http://www.w3.org/ns/hydra/core#Collection');
    expect(object).toHaveProperty(['http://www.w3.org/ns/hydra/core#title']);
    expect(object).toHaveProperty(['http://www.w3.org/ns/hydra/core#manages']);
    expect(object).toHaveProperty(['http://www.w3.org/ns/hydra/core#totalItems']);
    expect(object['http://www.w3.org/ns/hydra/core#totalItems'][0]['@value']).toEqual(2);
    expect(object).toHaveProperty(['http://www.w3.org/ns/hydra/core#member']);
    expect(object['http://www.w3.org/ns/hydra/core#member'][0]['@list']).toHaveLength(2);
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
