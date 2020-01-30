import createHttpError from 'http-errors';
import { OK } from 'http-status-codes';
import { Next } from 'koa';
import url from 'url';
import { AppContext, AppMiddleware } from '../app';
import ArticleNotFound from '../errors/article-not-found';

export default (): AppMiddleware => (
  async ({
    articles, dataFactory: { namedNode }, request, response,
  }: AppContext, next: Next): Promise<void> => {
    const id = namedNode(url.resolve(request.origin, request.path));

    try {
      response.dataset = await articles.get(id);
    } catch (error) {
      if (error instanceof ArticleNotFound) {
        throw new createHttpError.NotFound(error.message);
      }

      throw error;
    }

    response.status = OK;

    await next();
  }
);
