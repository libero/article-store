import { ExtendableContext, Response } from 'koa';
import parseLinkHeader from 'parse-link-header';
import apiDocumentation from '../../src/middleware/api-documentation-link';
import { createContext } from '../context';
import runMiddleware, { NextMiddleware } from '../middleware';

const makeRequest = async (next?: NextMiddleware<ExtendableContext>): Promise<Response> => (
  runMiddleware(apiDocumentation('/path-to/api-documentation'), createContext(), next)
);

describe('API documentation link middleware', (): void => {
  it('adds the API documentation link', async (): Promise<void> => {
    const response = await makeRequest();

    const expected = {
      'http://www.w3.org/ns/hydra/core#apiDocumentation': {
        rel: 'http://www.w3.org/ns/hydra/core#apiDocumentation',
        url: 'http://example.com/path-to/api-documentation',
      },
    };

    expect(parseLinkHeader(response.get('Link'))).toStrictEqual(expected);
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
