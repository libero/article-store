import createHttpError, { HttpError } from 'http-errors';
import type {
  DefaultStateExtends, ExtendableContext, Middleware, Next,
} from 'koa';
import { hydra, rdf } from '../namespaces';
import type { DatasetContext } from './dataset';

const handleHttpError = (
  error: HttpError,
  {
    dataFactory: {
      blankNode, dataset, literal, quad,
    },
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

export default (): Middleware<DefaultStateExtends, DatasetContext<ExtendableContext>> => (
  async (context: DatasetContext<ExtendableContext>, next: Next): Promise<void> => {
    try {
      await next();
    } catch (error) {
      handleHttpError(createHttpError(error), context);

      context.app.emit('error', error, context);
    }
  }
);
