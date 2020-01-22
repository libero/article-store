import createHttpError from 'http-errors';
import { OK } from 'http-status-codes';
import {
  DefaultStateExtends, Middleware, Next,
} from 'koa';
import url from 'url';
import Articles from '../articles';
import { namedNode } from '../data-factory';
import ArticleNotFound from '../errors/article-not-found';
import { DatasetContext } from '../middleware/dataset';

export default (articles: Articles): Middleware<DefaultStateExtends, DatasetContext> => (
  async ({ request, response }: DatasetContext, next: Next): Promise<void> => {
    try {
      await next();
    } catch (error) {
      if (!(error instanceof createHttpError.NotFound)) {
        throw error;
      }

      try {
        response.dataset = await articles.get(namedNode(url.resolve(request.origin, request.url)));
      } catch (getError) {
        if (getError instanceof ArticleNotFound) {
          throw new createHttpError.NotFound(getError.message);
        }

        throw getError;
      }

      response.status = OK;
    }
  }
);
