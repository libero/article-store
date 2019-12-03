import { constants } from 'http2';
import { Context, Middleware, Next } from 'koa';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import createHttpError from 'http-errors';
import Articles from '../articles';

export default (articles: Articles): Middleware => (
  async ({ request, response }: Context, next: Next): Promise<void> => {
    const article = request.body as JsonLdObj;
    try {
      await articles.add(article);
    } catch {
      throw new createHttpError.NotImplemented();
    }

    response.status = constants.HTTP_STATUS_NO_CONTENT;
    response.type = 'jsonld';

    await next();
  }
);
