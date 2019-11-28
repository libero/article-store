import jsonld from 'jsonld';
import { Next, Response } from 'koa';
import articleList from '../../src/routes/article-list';
import createContext from '../context';
import runMiddleware from '../middleware';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';

const makeRequest = async (next?: Next): Promise<Response> => {
  const context = createContext();
  const articles = new InMemoryArticles();

  return runMiddleware(articleList(articles, context.router), context, next);
};

describe('article list', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.status).toBe(200);
    expect(response.type).toBe('application/ld+json');
  });

  it('should return the list', async (): Promise<void> => {
    const response = await makeRequest();
    const graph = await jsonld.expand(response.body);

    expect(graph).toHaveLength(1);

    const object = graph[0];

    expect(object['@id']).toBe('http://example.com/path-to/article-list');
    expect(object['@type']).toContain('http://www.w3.org/ns/hydra/core#Collection');
    expect(object).toHaveProperty(['http://www.w3.org/ns/hydra/core#title']);
    expect(object).toHaveProperty(['http://www.w3.org/ns/hydra/core#manages']);
    expect(object).toHaveProperty(['http://www.w3.org/ns/hydra/core#totalItems']);
    expect(object).toHaveProperty(['http://www.w3.org/ns/hydra/core#member']);
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
