import { constants } from 'http2';
import { Context, Middleware, Next } from 'koa';
import Articles from '../articles';

export default (articles: Articles): Middleware => (
  async ({ request, response }: Context, next: Next): Promise<void> => {
    // TODO: Add the article received in the request.
    response.status = constants.HTTP_STATUS_OK;
    response.type = 'jsonld';

    await next();
  }
);
