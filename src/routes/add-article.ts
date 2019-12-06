import createHttpError from 'http-errors';
import { constants } from 'http2';
import jsonld from 'jsonld';
import { JsonLdArray } from 'jsonld/jsonld-spec';
import { Context, Middleware, Next } from 'koa';
import uniqueString from 'unique-string';
import { schema } from 'rdf-namespaces';
import Articles from '../articles';

export default (articles: Articles): Middleware => (
  async ({ request, response }: Context, next: Next): Promise<void> => {
    const [article] = await jsonld.expand(request.body) as JsonLdArray;
    if (!(article['@type'].includes(schema.Article))) {
      throw new createHttpError.Forbidden(`Article type must be ${schema.Article} ('${article['@type'].join(', ')}' was given)`);
    }
    if ('@id' in article) {
      throw new createHttpError.Forbidden(`Article IDs must not be set ('${article['@id']}' was given)`);
    }
    if (!(schema.name in article) && article[schema.name].length) {
      throw new createHttpError.Forbidden(`Article must have at least one ${schema.name}`);
    }

    article['@id'] = `_:${uniqueString()}`;
    await articles.add(article);

    response.status = constants.HTTP_STATUS_NO_CONTENT;

    await next();
  }
);
