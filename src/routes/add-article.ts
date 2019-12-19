import createHttpError from 'http-errors';
import { constants } from 'http2';
import { Next } from 'koa';
import url from 'url';
import { AppContext, AppMiddleware } from '../app';
import NotAnArticle from '../errors/not-an-article';
import Routes from './index';
import { rdf, schema } from '../namespaces';

export default (): AppMiddleware => (
  async ({
    articles, request, response, router,
  }: AppContext, next: Next): Promise<void> => {
    const foundArticles = request.dataset.match(undefined, rdf.type, schema.Article);

    if (foundArticles.size > 1) {
      throw new createHttpError.BadRequest('Multiple articles found');
    }

    if (foundArticles.size === 0) {
      throw new createHttpError.BadRequest(`No ${schema.Article.value} found`);
    }

    const id = [...foundArticles][0].subject;

    if (id.termType !== 'BlankNode') {
      throw new createHttpError.BadRequest(`Article must have a blank node identifier (${id.value} given)`);
    }

    if (request.dataset.match(id, schema('name')).size === 0) {
      throw new createHttpError.BadRequest(`Article must have at least one ${schema('name').value}`);
    }

    try {
      await articles.set(id, request.dataset);
    } catch (error) {
      if (error instanceof NotAnArticle) {
        throw new createHttpError.BadRequest(error.message);
      }

      throw error;
    }

    response.status = constants.HTTP_STATUS_CREATED;
    response.set('Location', url.resolve(request.origin, router.url(Routes.ArticleList)));

    await next();
  }
);
