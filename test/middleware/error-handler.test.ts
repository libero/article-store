import dataFactory, {
  blankNode, literal, namedNode, quad,
} from '@rdfjs/data-model';
import createHttpError, { UnknownError } from 'http-errors';
import 'jest-rdf';
import { Response } from 'koa';
import errorHandler from '../../src/middleware/error-handler';
import { captureQuads } from '../rdf';
import createContext, { ErrorListener } from '../context';
import runMiddleware, { Next } from '../middleware';

const makeRequest = async (next?: Next, errorListener?: ErrorListener): Promise<Response> => (
  runMiddleware(errorHandler(dataFactory), createContext({ errorListener }), next)
);

const next = (error: UnknownError) => async (): Promise<void> => {
  throw error;
};

describe('error-handler middleware', (): void => {
  describe('for an http error', (): void => {
    it('should capture the error and return an error response', async (): Promise<void> => {
      const response = await makeRequest(next(new createHttpError.ServiceUnavailable()));

      expect(response.status).toBe(503);
    });

    it('should emit the error', async (): Promise<void> => {
      const error = new createHttpError.ServiceUnavailable();
      const errorListener = jest.fn();

      const response = await makeRequest(next(error), errorListener);

      expect(errorListener).toHaveBeenCalledTimes(1);
      expect(errorListener).toHaveBeenCalledWith(error, expect.objectContaining({ response }));
    });

    it('should return details about the error', async (): Promise<void> => {
      const error = new createHttpError.ServiceUnavailable();
      const quads = await makeRequest(next(error)).then(captureQuads);

      const expected = [
        quad(blankNode(), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/ns/hydra/core#Status')),
        quad(blankNode(), namedNode('http://www.w3.org/ns/hydra/core#title'), literal('Service Unavailable', 'en')),
      ];

      expect(quads).toEqualRdfQuadArray(expected);
    });
  });

  describe('for a non-http error', (): void => {
    it('should capture the error and return an error response', async (): Promise<void> => {
      const response = await makeRequest(next('some-error'));

      expect(response.status).toBe(500);
    });

    it('should emit the error', async (): Promise<void> => {
      const error = 'some-error';
      const errorListener = jest.fn();

      const response = await makeRequest(next(error), errorListener);

      expect(errorListener).toHaveBeenCalledTimes(1);
      expect(errorListener).toHaveBeenCalledWith(error, expect.objectContaining({ response }));
    });

    it('should return details about the error', async (): Promise<void> => {
      const quads = await makeRequest(next('Some Error')).then(captureQuads);

      const expected = [
        quad(blankNode(), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/ns/hydra/core#Status')),
        quad(blankNode(), namedNode('http://www.w3.org/ns/hydra/core#title'), literal('Internal Server Error', 'en')),
        quad(blankNode(), namedNode('http://www.w3.org/ns/hydra/core#description'), literal('Some Error', 'en')),
      ];

      expect(quads).toEqualRdfQuadArray(expected);
    });
  });

  it('should do nothing if no error was thrown', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.status).toBe(undefined);
  });
});
