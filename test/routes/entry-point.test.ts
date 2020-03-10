import { namedNode, quad } from '@rdfjs/data-model';
import { OK } from 'http-status-codes';
import 'jest-rdf';
import type { Response } from 'koa';
import type { WithDataset } from '../../src/middleware/dataset';
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

    expect(dataset).toBeRdfDatasetContaining(quad(id, rdf.type, schema.EntryPoint));
    expect(dataset).toBeRdfDatasetMatching({ subject: id, predicate: schema('name') });
    expect(dataset).toBeRdfDatasetMatching({ subject: id, predicate: hydra.collection });
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
