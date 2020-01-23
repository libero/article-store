import createHttpError from 'http-errors';
import { OK } from 'http-status-codes';
import { Next } from 'koa';
import url from 'url';
import { AppContext, AppMiddleware } from '../app';
import { namedNode } from '../data-factory';
import ArticleNotFound from '../errors/article-not-found';

export default (): AppMiddleware => (
  async ({
    path, articles, request, response,
  }: AppContext, next: Next): Promise<void> => {
    try {
      await next();
      return;
    } catch (error) {
      if (!(error instanceof createHttpError.NotFound)) {
        throw error;
      }
    }

    try {
      response.dataset = await articles.get(namedNode(url.resolve(request.origin, path)));
    } catch (error) {
      if (error instanceof ArticleNotFound) {
        throw new createHttpError.NotFound(error.message);
      }

      throw error;
    }

    response.status = OK;
  }
);
