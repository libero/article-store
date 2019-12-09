import { Iri } from 'jsonld/jsonld-spec';

export default class ArticleNotFound extends Error {
  readonly id: Iri;

  constructor(id: Iri) {
    super(`Article ${id} could not be found`);

    this.id = id;
  }
}
