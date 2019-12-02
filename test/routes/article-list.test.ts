import 'jest-rdf';
import { Next, Response } from 'koa';
import { DataFactory, Store as N3Store } from 'n3';
import { Store } from 'rdf-js';
import { rdf, schema } from '../../src/namespaces';
import articleList from '../../src/routes/article-list';
import createContext from '../context';
import runMiddleware from '../middleware';
import { captureQuads } from '../rdf';

const {
  blankNode, literal, namedNode, quad,
} = DataFactory;

const makeRequest = async (
  next?: Next,
  articles: Store = new N3Store(),
): Promise<Response> => {
  const context = createContext();

  return runMiddleware(articleList(articles, context.router, DataFactory), context, next);
};

describe('article list', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.status).toBe(200);
  });

  it('should return an empty list', async (): Promise<void> => {
    const quads = await makeRequest().then(captureQuads);

    const id = namedNode('http://example.com/path-to/article-list');
    const manages = blankNode();

    const expected = [
      quad(id, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/ns/hydra/core#Collection')),
      quad(id, namedNode('http://www.w3.org/ns/hydra/core#title'), literal('List of articles', 'en')),
      quad(id, namedNode('http://www.w3.org/ns/hydra/core#manages'), manages),
      quad(manages, namedNode('http://www.w3.org/ns/hydra/core#property'), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')),
      quad(manages, namedNode('http://www.w3.org/ns/hydra/core#object'), namedNode('http://schema.org/Article')),
    ];

    expect(quads).toBeRdfIsomorphic(expected);
  });

  it('should return articles in the list', async (): Promise<void> => {
    const article1 = blankNode();
    const article2 = blankNode();
    const articles = new N3Store([
      quad(article1, rdf('type'), schema('Article'), article1),
      quad(article1, schema('name'), DataFactory.literal(`Article ${article1.value}`, 'en'), article1),
      quad(article2, rdf('type'), schema('Article'), article2),
      quad(article2, schema('name'), DataFactory.literal(`Article ${article2.value}`, 'en'), article2),
    ]);

    const quads = await makeRequest(undefined, articles).then(captureQuads);

    const id = namedNode('http://example.com/path-to/article-list');
    const manages = blankNode();

    const expected = [
      quad(id, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/ns/hydra/core#Collection')),
      quad(id, namedNode('http://www.w3.org/ns/hydra/core#title'), literal('List of articles', 'en')),
      quad(id, namedNode('http://www.w3.org/ns/hydra/core#manages'), manages),
      quad(manages, namedNode('http://www.w3.org/ns/hydra/core#property'), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')),
      quad(manages, namedNode('http://www.w3.org/ns/hydra/core#object'), namedNode('http://schema.org/Article')),
      quad(id, namedNode('http://www.w3.org/ns/hydra/core#member'), article1),
      quad(article1, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://schema.org/Article')),
      quad(article1, namedNode('http://schema.org/name'), DataFactory.literal(`Article ${article1.value}`, 'en')),
      quad(id, namedNode('http://www.w3.org/ns/hydra/core#member'), article2),
      quad(article2, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://schema.org/Article')),
      quad(article2, namedNode('http://schema.org/name'), DataFactory.literal(`Article ${article2.value}`, 'en')),
    ];

    expect(quads).toBeRdfIsomorphic(expected);
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
