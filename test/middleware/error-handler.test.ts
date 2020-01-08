import createHttpError, { UnknownError } from 'http-errors';
import jsonld from 'jsonld';
import { Response } from 'koa';
import errorHandler from '../../src/middleware/error-handler';
import createContext, { ErrorListener } from '../context';
import runMiddleware, { NextMiddleware } from '../middleware';

const makeRequest = async (next?: NextMiddleware, errorListener?: ErrorListener): Promise<Response> => {
  const context = createContext({ errorListener });

  return runMiddleware(errorHandler(), context, next);
};

const next = (error: UnknownError) => async (): Promise<void> => {
  throw error;
};

describe('error-handler middleware', (): void => {
  describe('for an http error', (): void => {
    it('should capture the error and return an error response', async (): Promise<void> => {
      const response = await makeRequest(next(new createHttpError.ServiceUnavailable()));

      expect(response.status).toBe(503);
      expect(response.type).toBe('application/ld+json');
    });

    it('should emit the error', async (): Promise<void> => {
      const error = new createHttpError.ServiceUnavailable();
      const errorListener = jest.fn();

      const response = await makeRequest(next(error), errorListener);

      expect(errorListener).toHaveBeenCalledTimes(1);
      expect(errorListener).toHaveBeenCalledWith(error, expect.objectContaining({ response }));
    });

    it('should return details about the error', async (): Promise<void> => {
      const response = await makeRequest(next(new createHttpError.ServiceUnavailable()));
      const object = await jsonld.compact(response.body, { '@language': 'en' });

      expect(object).not.toHaveProperty('@id');
      expect(object['@type']).toBe('http://www.w3.org/ns/hydra/core#Status');
      expect(object['http://www.w3.org/ns/hydra/core#title']).toBe('Service Unavailable');
      expect(object).not.toHaveProperty(['http://www.w3.org/ns/hydra/core#description']);
    });
  });

  describe('for a non-http error', (): void => {
    it('should capture the error and return an error response', async (): Promise<void> => {
      const response = await makeRequest(next('some-error'));

      expect(response.status).toBe(500);
      expect(response.type).toBe('application/ld+json');
    });

    it('should emit the error', async (): Promise<void> => {
      const error = 'some-error';
      const errorListener = jest.fn();

      const response = await makeRequest(next(error), errorListener);

      expect(errorListener).toHaveBeenCalledTimes(1);
      expect(errorListener).toHaveBeenCalledWith(error, expect.objectContaining({ response }));
    });

    it('should return details about the error', async (): Promise<void> => {
      const response = await makeRequest(next('Some Error'));
      const object = await jsonld.compact(response.body, { '@language': 'en' });

      expect(object).not.toHaveProperty('@id');
      expect(object['@type']).toBe('http://www.w3.org/ns/hydra/core#Status');
      expect(object['http://www.w3.org/ns/hydra/core#title']).toBe('Internal Server Error');
      expect(object['http://www.w3.org/ns/hydra/core#description']).toBe('Some Error');
    });
  });

  it('should do nothing if no error was thrown', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.status).toBe(undefined);
  });
});
