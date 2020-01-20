import clownface from 'clownface';
import createHttpError from 'http-errors';
import { constants } from 'http2';
import { Next } from 'koa';
import { addAll } from 'rdf-dataset-ext';
import url from 'url';
import { AppContext, AppMiddleware } from '../app';
import ArticleNotFound from '../errors/article-not-found';

export default (): AppMiddleware => (
  async ({
    dataFactory: { namedNode }, articles, path, request, response,
  }: AppContext, next: Next): Promise<void> => {
    if (!response.status || response.status === constants.HTTP_STATUS_NOT_FOUND) {
      const articleNamedNode = namedNode(url.resolve(request.origin, path));
      const graph = clownface({
        dataset: response.dataset,
        term: articleNamedNode,
      });
      try {
        await articles.get(articleNamedNode).then((article) => {
          addAll(graph.dataset, article);
        });
      } catch (error) {
        if (error instanceof ArticleNotFound) {
          throw new createHttpError.NotFound(error.message);
        }

        throw error;
      }

      response.status = constants.HTTP_STATUS_OK;
    }

    await next();
  }
);
