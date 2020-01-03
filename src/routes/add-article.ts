import createHttpError from 'http-errors';
import { constants } from 'http2';
import { Next } from 'koa';
import { Quad } from 'rdf-js';
import { termToString } from 'rdf-string';
import uniqueString from 'unique-string';
import url from 'url';
import { AppContext, AppMiddleware } from '../app';
import NotAnArticle from '../errors/not-an-article';
import { rdf, schema } from '../namespaces';
import Routes from './index';

export default (): AppMiddleware => (
  async ({
    articles, dataFactory: { blankNode, quad }, request, response, router,
  }: AppContext, next: Next): Promise<void> => {
    const foundArticles = request.dataset.match(undefined, rdf.type, schema.Article);

    if (foundArticles.size > 1) {
      throw new createHttpError.BadRequest('Multiple articles found');
    }

    if (foundArticles.size === 0) {
      throw new createHttpError.BadRequest(`No ${termToString(schema.Article)} found`);
    }

    const id = [...foundArticles][0].subject;

    if (id.termType !== 'BlankNode') {
      throw new createHttpError.BadRequest(`Article must have a blank node identifier (${termToString(id)} given)`);
    }

    if (request.dataset.match(id, schema('name')).size === 0) {
      throw new createHttpError.BadRequest(`Article must have at least one ${termToString(schema('name'))}`);
    }

    const newId = blankNode(uniqueString());

    [...request.dataset].forEach((originalQuad: Quad): void => {
      let newQuad: Quad;
      if (originalQuad.subject.equals(id)) {
        newQuad = quad(newId, originalQuad.predicate, originalQuad.object, originalQuad.graph);
      } else if (originalQuad.object.equals(id)) {
        newQuad = quad(originalQuad.subject, originalQuad.predicate, newId, originalQuad.graph);
      } else {
        return;
      }

      request.dataset.delete(originalQuad).add(newQuad);
    });

    try {
      await articles.set(newId, request.dataset);
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
