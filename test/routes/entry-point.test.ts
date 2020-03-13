import { literal, namedNode, quad } from '@rdfjs/data-model';
import { OK } from 'http-status-codes';
import 'jest-rdf';
import { Response } from 'koa';
import { WithDataset } from '../../src/middleware/dataset';
import { hydra, rdf, schema } from '../../src/namespaces';
import entryPoint from '../../src/routes/entry-point';
import createContext from '../context';
import runMiddleware, { NextMiddleware } from '../middleware';

const makeRequest = async (next?: NextMiddleware): Promise<WithDataset<Response>> => (
  runMiddleware(entryPoint(), createContext(), next)
);

describe('entry-point', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.status).toBe(OK);
  });

  it('should return the entry point', async (): Promise<void> => {
    const { dataset } = await makeRequest();
    const id = namedNode('http://example.com/path-to/entry-point');

    expect(dataset).toBeRdfDatasetContaining(
      quad(id, rdf.type, schema.EntryPoint),
      quad(id, schema('name'), literal('Article Store', 'en')),
    );
  });

  it('should return the article list', async (): Promise<void> => {
    const { dataset } = await makeRequest();
    const id = namedNode('http://example.com/path-to/entry-point');
    const collection = namedNode('http://example.com/path-to/article-list');

    expect(dataset).toBeRdfDatasetContaining(
      quad(id, hydra.collection, collection),
      quad(collection, rdf.type, hydra.Collection),
    );
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
