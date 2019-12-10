import createError, { HttpError, UnknownError } from 'http-errors';
import { Context, Middleware, Next } from 'koa';
import { hydra } from 'rdf-namespaces';

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

const toHttpError = (error: UnknownError): HttpError => (
  error instanceof HttpError ? error : createError(error)
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
