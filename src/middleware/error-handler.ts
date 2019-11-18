import createError, { HttpError, CreateHttpError } from 'http-errors';
import { Context, Middleware, Next } from 'koa';
import { hydra } from 'rdf-namespaces';

type UnknownError<T = CreateHttpError> = T extends (
    (event: infer ErrorShape, ...args: unknown[]) => HttpError
  ) ? ErrorShape : never;

const handleHttpError = (error: HttpError, { response }: Context): void => {
  response.status = error.status;
  response.body = {
    '@type': hydra.Status,
    [hydra.title]: { '@value': response.message, '@language': 'en' },
  };

  if (error.message !== response.message) {
    response.body[hydra.description] = { '@value': error.message, '@language': 'en' };
  }

  response.type = 'jsonld';
};

const toHttpError = (error: unknown): HttpError => (
  error instanceof HttpError ? error : createError(error as UnknownError)
);

export default (): Middleware => (
  async (context: Context, next: Next): Promise<void> => {
    try {
      await next();
    } catch (error) {
      handleHttpError(toHttpError(error), context);

      context.app.emit('error', error, context);
    }
  }
);
