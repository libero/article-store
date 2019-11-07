import request from 'supertest';
import app from '../src/app';

describe('the application', (): void => {
  it('should response with 200 OK', async (): Promise<void> => {
    const response = await request(app.callback()).get('/');

    expect(response.status).toEqual(200);
  });
});
