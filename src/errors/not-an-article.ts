import { Quad_Object as QuadObject } from 'rdf-js';

export default class NotAnArticle extends Error {
  readonly types: Array<QuadObject>;

  constructor(types: Array<QuadObject> = []) {
    super(`Article type must be http://schema.org/Article (${types.length ? `'${types.map((type: QuadObject): string => type.value).join(', ')}'` : 'none'} was given)`);

    this.types = types;
  }
}
