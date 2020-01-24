import { NamedNode } from 'rdf-js';
import { termToString } from 'rdf-string';

export default class ArticleNotFound extends Error {
  readonly id: NamedNode;

  constructor(id: NamedNode) {
    super(`Article ${termToString(id)} could not be found`);

    this.id = id;
  }
}
