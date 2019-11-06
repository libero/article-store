import app from '../src/app';
import request from 'supertest';

describe('the application', (): void => {

  it('should response with 200 OK', async (): Promise<void> => {
    const response = await request(app.callback()).get('/');

    expect(response.status).toEqual(200);
  });

});
