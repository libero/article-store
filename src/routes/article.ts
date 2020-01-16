import clownface from 'clownface';
import createHttpError from 'http-errors';
import { constants } from 'http2';
import { Next } from 'koa';
import { addAll } from 'rdf-dataset-ext';
import url from 'url';
import { AppContext, AppMiddleware } from '../app';

export default (): AppMiddleware => (
  async ({
    dataFactory: { namedNode }, articles, request, response,
  }: AppContext, next: Next): Promise<void> => {
    if (response.status === constants.HTTP_STATUS_NOT_FOUND) {
      const articleNamedNode = namedNode(url.resolve(request.origin, request.url));
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
