import clownface from 'clownface';
import createHttpError from 'http-errors';
import { constants } from 'http2';
import { Next } from 'koa';
import { Quad } from 'rdf-js';
import { termToString } from 'rdf-string';
import uniqueString from 'unique-string';
import url from 'url';
import { AppContext, AppMiddleware } from '../app';
import { rdf, schema } from '../namespaces';
import Routes from './index';

export default (): AppMiddleware => (
  async ({
    articles, dataFactory: { namedNode, quad }, request, response, router,
  }: AppContext, next: Next): Promise<void> => {
    console.log(request.dataset);
    const id = clownface({ dataset: request.dataset }).has(rdf.type, schema.Article).term;

    if (!id) {
      throw new createHttpError.BadRequest(`No ${termToString(schema.Article)} found`);
    }

    if (id.termType !== 'BlankNode') {
      throw new createHttpError.BadRequest(`Article must have a blank node identifier (${termToString(id)} given)`);
    }

    if (request.dataset.match(id, schema('name')).size === 0) {
      throw new createHttpError.BadRequest(`Article must have at least one ${termToString(schema('name'))}`);
    }

    const newId = namedNode(uniqueString());

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

    await articles.set(newId, request.dataset);

    response.status = constants.HTTP_STATUS_CREATED;
    response.set('Location', url.resolve(request.origin, router.url(Routes.ArticleList)));

    await next();
  }
);
