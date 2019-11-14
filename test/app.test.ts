import parseLinkHeader from 'parse-link-header';
import request from 'supertest';
import app from '../src/app';

const trim = (value: string): string => value.trim();
const parseHeader = (header: string): Array<string> => header.split(',').map(trim);

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
  });

  it('should have an API documentation link', async (): Promise<void> => {
    const response = await request(app.callback()).get('/');

    expect(parseLinkHeader(response.get('Link'))).toHaveProperty(['http://www.w3.org/ns/hydra/core#apiDocumentation']);
  });
});
