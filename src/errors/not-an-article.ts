import { Quad_Object as QuadObject } from 'rdf-js';
import { termToString } from 'rdf-string';
import { schema } from '../namespaces';

export default class NotAnArticle extends Error {
  readonly types: Array<QuadObject>;

  constructor(types: Array<QuadObject> = []) {
    super(`Article type must be ${termToString(schema.Article)} (${types.length ? `'${types.map(termToString).join(', ')}'` : 'none'} was given)`);

    this.types = types;
  }
}
