import request from 'supertest';
import app from '../src/app';

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
    expect(response.get('Vary')).toContain('Origin');
  });
});
