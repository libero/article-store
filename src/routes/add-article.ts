import createHttpError from 'http-errors';
import { constants } from 'http2';
import jsonld from 'jsonld';
import { JsonLdArray } from 'jsonld/jsonld-spec';
import { Next } from 'koa';
import { schema } from 'rdf-namespaces';
import uniqueString from 'unique-string';
import { AppContext, AppMiddleware } from '../app';

export default (): AppMiddleware => (
  async ({ articles, request, response }: AppContext, next: Next): Promise<void> => {
    const [article] = await jsonld.expand(request.body) as JsonLdArray;
    if ('@id' in article) {
      throw new createHttpError.Forbidden(`Article IDs must not be set ('${article['@id']}' was given)`);
    }
    if (!(schema.name in article) || article[schema.name].length === 0) {
      throw new createHttpError.BadRequest(`Article must have at least one ${schema.name}`);
    }

    article['@id'] = `_:${uniqueString()}`;
    await articles.add(article);

    response.status = constants.HTTP_STATUS_NO_CONTENT;

    await next();
  }
);
