import { constants } from 'http2';
import { Context, Middleware, Next } from 'koa';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import uniqueString from 'unique-string';
import Articles from '../articles';
import createHttpError from 'http-errors';

export default (articles: Articles): Middleware => (
  async ({ request, response }: Context, next: Next): Promise<void> => {
    const article = request.body as JsonLdObj;
    if ('@id' in article) {
      throw new createHttpError.Forbidden('Article ID is not permitted');
    }

    article['@id'] = `_:${uniqueString()}`;
    await articles.add(article);

    response.status = constants.HTTP_STATUS_NO_CONTENT;

    await next();
  }
);
