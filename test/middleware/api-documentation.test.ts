import { Response } from 'koa';
import parseLinkHeader from 'parse-link-header';
import apiDocumentation from '../../src/middleware/api-documentation-link';
import createContext from '../context';
import runMiddleware from '../middleware';

const makeRequest = async (): Promise<Response> => (
  runMiddleware(apiDocumentation('/path-to/api-documentation'), createContext())
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
});
