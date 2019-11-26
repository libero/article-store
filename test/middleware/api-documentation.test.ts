import { Response } from 'koa';
import parseLinkHeader from 'parse-link-header';
import apiDocumentation from '../../src/middleware/api-documentation';
import createContext from '../context';
import runMiddleware from '../middleware';

const makeRequest = async (): Promise<Response> => (
  runMiddleware(apiDocumentation(), createContext())
);

describe('API documentation middleware', (): void => {
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
