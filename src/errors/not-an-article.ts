import { Term } from 'rdf-js';
import { termToString } from 'rdf-string';

export default class NotAnArticle extends Error {
  readonly types: Array<Term>;

  constructor(types: Array<Term> = []) {
    super(`Article type must be http://schema.org/Article (${types.length ? `'${types.map(termToString).join(', ')}'` : 'none'} was given)`);

    this.types = types;
  }
}
