import createHttpError from 'http-errors';
import { constants } from 'http2';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import { Context, Middleware, Next } from 'koa';
import uniqueString from 'unique-string';
import Articles from '../articles';

export default (articles: Articles): Middleware => (
  async ({ request, response }: Context, next: Next): Promise<void> => {
    const article = request.body as JsonLdObj;
    if ('@id' in article) {
      throw new createHttpError.Forbidden(`Article IDs must not be set ('${article['@id']}' was given)`);
    }

    article['@id'] = `_:${uniqueString()}`;
    await articles.add(article);

    response.status = constants.HTTP_STATUS_NO_CONTENT;

    await next();
  }
);
