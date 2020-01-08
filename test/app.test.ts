import dataFactory from '@rdfjs/data-model';
import parseLinkHeader from 'parse-link-header';
import request from 'supertest';
import InMemoryArticles from '../src/adaptors/in-memory-articles';
import createApp, { App } from '../src/app';
import createRouter from '../src/router';
import Routes from '../src/routes';

const trim = (value: string): string => value.trim();
const parseHeader = (header: string): Array<string> => header.split(',').map(trim);

const router = createRouter();
let app: App;

beforeEach((): void => {
  app = createApp(new InMemoryArticles(), router, router.url(Routes.ApiDocumentation), dataFactory);
});

describe('the application', (): void => {
  it('should respond with 200 OK on the root', async (): Promise<void> => {
    const response = await request(app.callback()).get('/');

    expect(response.status).toEqual(200);
  });

  it('should respond with 404 Not Found on an unknown path', async (): Promise<void> => {
    const response = await request(app.callback()).get('/does-not-exist');

    expect(response.status).toEqual(404);
  });

  it('should support cross-origin requests', async (): Promise<void> => {
    const response = await request(app.callback()).get('/').set('Origin', 'http://example.com');

    expect(response.get('Access-Control-Allow-Origin')).toBe('http://example.com');
    expect(parseHeader(response.get('Vary'))).toContain('Origin');
    expect(parseHeader(response.get('Access-Control-Expose-Headers'))).toContain('Link');
  });

  it('should have an API documentation link', async (): Promise<void> => {
    const response = await request(app.callback()).get('/');

    expect(parseLinkHeader(response.get('Link'))).toHaveProperty(['http://www.w3.org/ns/hydra/core#apiDocumentation']);
  });
});
