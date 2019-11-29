import { Iri } from 'jsonld/jsonld-spec';

export default class ArticleNotFound extends Error {
  constructor(id: Iri) {
    super(`An item with the ID ${id} could not be found`);
  }
}
