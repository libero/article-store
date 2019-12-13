import { namedNode, quad } from '@rdfjs/data-model';
import { Next } from 'koa';
import { hydra, rdf } from '../../src/namespaces';
import apiDocumentation from '../../src/routes/api-documentation';
import createContext from '../context';
import runMiddleware, { DatasetResponse } from '../middleware';

const makeRequest = async (next?: Next): Promise<DatasetResponse> => (
  runMiddleware(apiDocumentation(), createContext(), next)
);

describe('API documentation', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.status).toBe(200);
  });

  it('should return the API documentation', async (): Promise<void> => {
    const { dataset } = await makeRequest();
    const id = namedNode('http://example.com/path-to/api-documentation');

    expect(dataset.has(quad(id, rdf.type, hydra.ApiDocumentation))).toBe(true);
    expect(dataset.match(id, hydra.entrypoint).size).toBe(1);
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
