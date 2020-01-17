import clownface from 'clownface';
import createHttpError from 'http-errors';
import { constants } from 'http2';
import { Next } from 'koa';
import { addAll } from 'rdf-dataset-ext';
import { AppContext, AppMiddleware } from '../app';

export default (): AppMiddleware => (
  async ({
    dataFactory: { namedNode }, articles, path, response,
  }: AppContext, next: Next): Promise<void> => {
    if (!response.status || response.status === constants.HTTP_STATUS_NOT_FOUND) {
      const articleNamedNode = namedNode(path);
      const graph = clownface({
        dataset: response.dataset,
        term: articleNamedNode,
      });
      try {
        await articles.get(articleNamedNode).then((article) => {
          addAll(graph.dataset, article);
        });
      } catch (error) {
        throw new createHttpError.NotFound(error.message);
      }

      response.status = constants.HTTP_STATUS_OK;
    }

    await next();
  }
);
