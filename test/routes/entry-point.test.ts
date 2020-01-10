import { namedNode, quad } from '@rdfjs/data-model';
import { Response } from 'koa';
import { WithDataset } from '../../src/middleware/dataset';
import { hydra, rdf, schema } from '../../src/namespaces';
import entryPoint from '../../src/routes/entry-point';
import createContext from '../context';
import runMiddleware, { NextMiddleware } from '../middleware';

const makeRequest = async (next?: NextMiddleware): Promise<WithDataset<Response>> => (
  runMiddleware(entryPoint(), createContext(), next)
);

/**
 * @group unit
 */
describe('entry-point', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.status).toBe(200);
  });

  it('should return the entry point', async (): Promise<void> => {
    const { dataset } = await makeRequest();
    const id = namedNode('http://example.com/path-to/entry-point');

    expect(dataset.has(quad(id, rdf.type, schema.EntryPoint))).toBe(true);
    expect(dataset.match(id, schema('name')).size).toBe(1);
    expect(dataset.match(id, hydra.collection).size).toBe(1);
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
