import createError, { HttpError, UnknownError } from 'http-errors';
import { DefaultState, Middleware, Next } from 'koa';
import { DataFactory, DatasetCoreFactory } from 'rdf-js';
import { hydra, rdf } from '../namespaces';
import { DatasetContext } from './dataset';

const handleHttpError = (
  error: HttpError,
  { blankNode, literal, quad }: DataFactory,
  { dataset }: DatasetCoreFactory,
  { response }: DatasetContext,
): void => {
  response.status = error.status;

  const id = blankNode();

  const quads = [
    quad(id, rdf.type, hydra.Status),
    quad(id, hydra.title, literal(response.message, 'en')),
  ];

  if (error.message !== response.message) {
    quads.push(
      quad(id, hydra.description, literal(error.message, 'en')),
    );
  }

  response.dataset = dataset(quads);
};

const toHttpError = (error: UnknownError): HttpError => (
  error instanceof HttpError ? error : createError(error)
);

export default (dataFactory: DataFactory, datasetFactory: DatasetCoreFactory):
  Middleware<DefaultState, DatasetContext> => (
  async (context: DatasetContext, next: Next): Promise<void> => {
    try {
      await next();
    } catch (error) {
      handleHttpError(toHttpError(error), dataFactory, datasetFactory, context);

      context.app.emit('error', error, context);
    }
  }
);
