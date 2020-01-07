import { Term } from 'rdf-js';
import { termToString } from 'rdf-string';
import { schema } from '../namespaces';

export default class NotAnArticle extends Error {
  readonly types: Array<Term>;

  constructor(types: Array<Term> = []) {
    super(`Article type must be ${termToString(schema.Article)} (${types.length ? `'${types.map(termToString).join(', ')}'` : 'none'} was given)`);

    this.types = types;
  }
}
