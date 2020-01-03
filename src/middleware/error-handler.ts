import createError, { HttpError, UnknownError } from 'http-errors';
import { DefaultState, Middleware, Next } from 'koa';
import { hydra, rdf } from '../namespaces';
import { DatasetContext } from './dataset';

const handleHttpError = (
  error: HttpError,
  {
    dataFactory: { blankNode, literal, quad },
    datasetFactory: { dataset },
    response,
  }: DatasetContext,
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

export default (): Middleware<DefaultState, DatasetContext> => (
  async (context: DatasetContext, next: Next): Promise<void> => {
    try {
      await next();
    } catch (error) {
      handleHttpError(toHttpError(error), context);

      context.app.emit('error', error, context);
    }
  }
);
