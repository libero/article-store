import { Response } from 'koa';
import parseLinkHeader from 'parse-link-header';
import apiDocumentation from '../../src/middleware/api-documentation';
import createContext from '../context';
import runMiddleware from '../middleware';

const makeRequest = async (): Promise<Response> => {
  const context = createContext();

  return runMiddleware(apiDocumentation(context.router), context);
};

describe('API documentation middleware', (): void => {
  it('adds the API documentation link', async (): Promise<void> => {
    const response = await makeRequest();

    const links = parseLinkHeader(response.get('Link'));

    expect(Object.keys(links)).toHaveLength(1);

    const link = links['http://www.w3.org/ns/hydra/core#apiDocumentation'];

    expect(link.url).toBe('http://example.com/path-to/api-documentation');
  });
});
