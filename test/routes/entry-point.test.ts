import dataFactory, { literal, namedNode, quad } from '@rdfjs/data-model';
import 'jest-rdf';
import { Next, Response } from 'koa';
import entryPoint from '../../src/routes/entry-point';
import { captureQuads } from '../rdf';
import createContext from '../context';
import runMiddleware from '../middleware';

const makeRequest = async (next?: Next): Promise<Response> => {
  const context = createContext();

  return runMiddleware(entryPoint(context.router, dataFactory), context, next);
};

describe('entry-point', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.status).toBe(200);
  });

  it('should return the entry point', async (): Promise<void> => {
    const quads = await makeRequest().then(captureQuads);

    const id = namedNode('http://example.com/path-to/entry-point');
    const collection = namedNode('http://example.com/path-to/article-list');

    const expected = [
      quad(id, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://schema.org/EntryPoint')),
      quad(id, namedNode('http://schema.org/name'), literal('Article Store', 'en')),
      quad(id, namedNode('http://www.w3.org/ns/hydra/core#collection'), collection),
      quad(collection, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/ns/hydra/core#Collection')),
    ];

    expect(quads).toBeRdfIsomorphic(expected);
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
