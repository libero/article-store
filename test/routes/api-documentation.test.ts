import 'jest-rdf';
import { Next, Response } from 'koa';
import { DataFactory } from 'n3';
import apiDocumentation from '../../src/routes/api-documentation';
import createContext from '../context';
import runMiddleware from '../middleware';
import { captureSource, toArray } from '../rdf';

const { namedNode } = DataFactory;

const makeRequest = async (next?: Next): Promise<Response> => {
  const context = createContext();

  return runMiddleware(apiDocumentation(context.router, DataFactory), context, next);
};

describe('API documentation', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.status).toBe(200);
  });

  it('should return the API documentation', async (): Promise<void> => {
    const source = await makeRequest().then(captureSource);

    const id = namedNode('http://example.com/path-to/api-documentation');

    expect(await toArray(source.match(id, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/ns/hydra/core#ApiDocumentation')))).toHaveLength(1);
    expect(await toArray(source.match(id, namedNode('http://www.w3.org/ns/hydra/core#entrypoint')))).toHaveLength(1);
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
