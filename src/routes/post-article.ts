import { constants } from 'http2';
import { Context, Middleware, Next } from 'koa';
import Articles from '../articles';

export default (articles: Articles): Middleware => (
  async ({ request, response }: Context, next: Next): Promise<void> => {
    articles.add(request.body);
    response.status = constants.HTTP_STATUS_NO_CONTENT;
    response.type = 'jsonld';

    await next();
  }
);
