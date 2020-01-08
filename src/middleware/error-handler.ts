import createError, { HttpError, UnknownError } from 'http-errors';
import {
  DefaultStateExtends, ExtendableContext, Middleware, Next,
} from 'koa';
import { hydra } from 'rdf-namespaces';

const handleHttpError = (error: HttpError, { response }: ExtendableContext): void => {
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

export default (): Middleware<DefaultStateExtends, ExtendableContext> => (
  async (context: ExtendableContext, next: Next): Promise<void> => {
    try {
      await next();
    } catch (error) {
      handleHttpError(toHttpError(error), context);

      context.app.emit('error', error, context);
    }
  }
);
