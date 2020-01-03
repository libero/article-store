import { BlankNode } from 'rdf-js';
import { termToString } from 'rdf-string';

export default class ArticleNotFound extends Error {
  readonly id: BlankNode;

  constructor(id: BlankNode) {
    super(`Article ${termToString(id)} could not be found`);

    this.id = id;
  }
}
