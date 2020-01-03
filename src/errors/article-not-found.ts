import { BlankNode } from 'rdf-js';

export default class ArticleNotFound extends Error {
  readonly id: BlankNode;

  constructor(id: BlankNode) {
    super(`Article ${id.value} could not be found`);

    this.id = id;
  }
}
