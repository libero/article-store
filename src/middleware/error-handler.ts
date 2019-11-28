import createError, { HttpError, UnknownError } from 'http-errors';
import { Context, Middleware, Next } from 'koa';
import { DataFactory } from 'rdf-js';
import { storeStream } from 'rdf-store-stream';
import { hydra, rdf } from '../namespaces';
import { fromArray } from '../stream';

const handleHttpError = async (
  error: HttpError,
  { response }: Context,
  { blankNode, quad, literal }: DataFactory,
): Promise<void> => {
  response.status = error.status;

  const id = blankNode();

  const quads = [
    quad(id, rdf('type'), hydra('Status')),
    quad(id, hydra('title'), literal(response.message, 'en')),
  ];

  if (error.message !== response.message) {
    quads.push(
      quad(id, hydra('description'), literal(error.message, 'en')),
    );
  }

  response.body = await storeStream(fromArray(quads));
};

const toHttpError = (error: UnknownError): HttpError => (
  error instanceof HttpError ? error : createError(error)
);

export default (dataFactory: DataFactory): Middleware => (
  async (context: Context, next: Next): Promise<void> => {
    try {
      await next();
    } catch (error) {
      await handleHttpError(toHttpError(error), context, dataFactory);

      context.app.emit('error', error, context);
    }
  }
);
