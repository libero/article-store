import { NamedNode } from 'rdf-js';

export default class ArticleNotFound extends Error {
  readonly id: NamedNode;

  constructor(id: NamedNode) {
    super(`Article ${id.value} could not be found`);

    this.id = id;
  }
}
