import clownface from 'clownface';
import createHttpError from 'http-errors';
import { constants } from 'http2';
import { Next } from 'koa';
import { AppContext, AppMiddleware } from '../app';
import NotAnArticle from '../errors/not-an-article';
import { rdf, schema } from '../namespaces';

export default (): AppMiddleware => (
  async ({ articles, request, response }: AppContext, next: Next): Promise<void> => {
    const graph = clownface({ dataset: request.dataset });

    const foundArticles = graph.has(rdf.type, schema.Article);

    if (foundArticles.terms.length > 1) {
      throw new createHttpError.BadRequest('Multiple articles found');
    }

    if (foundArticles.terms.length === 0) {
      throw new createHttpError.BadRequest(`No ${schema.Article.value} found`);
    }

    const id = foundArticles.terms[0];

    if (request.dataset.match(id, schema.name).size === 0) {
      throw new createHttpError.BadRequest(`Article must have at least one ${schema.name.value}`);
    }

    try {
      await articles.set(id, request.dataset);
    } catch (error) {
      if (error instanceof NotAnArticle) {
        throw new createHttpError.BadRequest(error.message);
      }

      throw error;
    }

    response.status = constants.HTTP_STATUS_NO_CONTENT;

    await next();
  }
);
