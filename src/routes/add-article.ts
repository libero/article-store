import createHttpError from 'http-errors';
import { constants } from 'http2';
import jsonld from 'jsonld';
import { JsonLdArray } from 'jsonld/jsonld-spec';
import { Next } from 'koa';
import { schema } from 'rdf-namespaces';
import uniqueString from 'unique-string';
import url from 'url';
import { AppContext, AppMiddleware } from '../app';
import NotAnArticle from '../errors/not-an-article';
import Routes from './index';

export default (): AppMiddleware => (
  async ({
    articles, request, response, router,
  }: AppContext, next: Next): Promise<void> => {
    const [article] = await jsonld.expand(request.body) as JsonLdArray;
    if ('@id' in article) {
      throw new createHttpError.Forbidden(`Article IDs must not be set ('${article['@id']}' was given)`);
    }
    if (!(schema.name in article) || article[schema.name].length === 0) {
      throw new createHttpError.BadRequest(`Article must have at least one ${schema.name}`);
    }

    article['@id'] = `_:${uniqueString()}`;

    try {
      await articles.add(article);
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
