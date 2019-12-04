import createHttpError from 'http-errors';
import { Iri } from 'jsonld/jsonld-spec';

export default class ArticleIdAlreadySet extends createHttpError.Conflict {
  readonly id: Iri;

  constructor(id: Iri) {
    super('Article ID is already set');

    this.id = id;
  }
}
