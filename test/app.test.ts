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
});
