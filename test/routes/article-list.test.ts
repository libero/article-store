import dataFactory, {
  blankNode, literal, namedNode, quad,
} from '@rdfjs/data-model';
import 'jest-rdf';
import { Next, Response } from 'koa';
import { toRdf } from 'rdf-literal';
import articleList from '../../src/routes/article-list';
import { captureQuads } from '../rdf';
import createContext from '../context';
import runMiddleware from '../middleware';

const makeRequest = async (next?: Next): Promise<Response> => {
  const context = createContext();

  return runMiddleware(articleList(context.router, dataFactory), context, next);
};

describe('article list', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.status).toBe(200);
  });

  it('should return the list', async (): Promise<void> => {
    const quads = await makeRequest().then(captureQuads);

    const id = namedNode('http://example.com/path-to/article-list');
    const manages = blankNode();
    const members = blankNode();

    const expected = [
      quad(id, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/ns/hydra/core#Collection')),
      quad(id, namedNode('http://www.w3.org/ns/hydra/core#title'), literal('List of articles', 'en')),
      quad(id, namedNode('http://www.w3.org/ns/hydra/core#manages'), manages),
      quad(manages, namedNode('http://www.w3.org/ns/hydra/core#property'), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')),
      quad(manages, namedNode('http://www.w3.org/ns/hydra/core#object'), namedNode('http://schema.org/Article')),
      quad(id, namedNode('http://www.w3.org/ns/hydra/core#totalItems'), toRdf(0)),
      quad(id, namedNode('http://www.w3.org/ns/hydra/core#member'), members),
    ];

    expect(quads).toBeRdfIsomorphic(expected);
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
