import { blankNode, literal, quad } from '@rdfjs/data-model';
import createHttpError from 'http-errors';
import { INTERNAL_SERVER_ERROR, SERVICE_UNAVAILABLE } from 'http-status-codes';
import 'jest-rdf';
import { Response } from 'koa';
import { WithDataset } from '../../src/middleware/dataset';
import errorHandler from '../../src/middleware/error-handler';
import { hydra, rdf } from '../../src/namespaces';
import createContext, { ErrorListener } from '../context';
import runMiddleware, { NextMiddleware, throwingNext } from '../middleware';

const makeRequest = async (next?: NextMiddleware, errorListener?: ErrorListener): Promise<WithDataset<Response>> => (
  runMiddleware(errorHandler(), createContext({ errorListener }), next)
);

describe('error-handler middleware', (): void => {
  describe('for an http error', (): void => {
    it('should capture the error and return an error response', async (): Promise<void> => {
      const response = await makeRequest(throwingNext(new createHttpError.ServiceUnavailable()));

      expect(response.status).toBe(SERVICE_UNAVAILABLE);
    });

    it('should emit the error', async (): Promise<void> => {
      const error = new createHttpError.ServiceUnavailable();
      const errorListener = jest.fn();

      const response = await makeRequest(throwingNext(error), errorListener);

      expect(errorListener).toHaveBeenCalledTimes(1);
      expect(errorListener).toHaveBeenCalledWith(error, expect.objectContaining({ response }));
    });

    it('should return details about the error', async (): Promise<void> => {
      const response = await makeRequest(throwingNext(new createHttpError.ServiceUnavailable()));

      const id = blankNode();
      const expected = [
        quad(id, rdf.type, hydra.Status),
        quad(id, hydra.title, literal('Service Unavailable', 'en')),
      ];

      expect([...response.dataset]).toEqualRdfQuadArray(expected);
    });
  });

  describe('for a non-http error', (): void => {
    it('should capture the error and return an error response', async (): Promise<void> => {
      const response = await makeRequest(throwingNext());

      expect(response.status).toBe(INTERNAL_SERVER_ERROR);
    });

    it('should emit the error', async (): Promise<void> => {
      const error = 'some-error';
      const errorListener = jest.fn();

      const response = await makeRequest(throwingNext(error), errorListener);

      expect(errorListener).toHaveBeenCalledTimes(1);
      expect(errorListener).toHaveBeenCalledWith(error, expect.objectContaining({ response }));
    });

    it('should return details about the error', async (): Promise<void> => {
      const response = await makeRequest(throwingNext('Some Error'));

      const id = blankNode();
      const expected = [
        quad(id, rdf.type, hydra.Status),
        quad(id, hydra.title, literal('Internal Server Error', 'en')),
        quad(id, hydra.description, literal('Some Error', 'en')),
      ];

      expect([...response.dataset]).toEqualRdfQuadArray(expected);
    });
  });

  it('should do nothing if no error was thrown', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.status).toBe(undefined);
    expect(response.dataset.size).toBe(0);
  });
});
