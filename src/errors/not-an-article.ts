import { Iri } from 'jsonld/jsonld-spec';

export default class NotAnArticle extends Error {
  readonly types: Array<Iri>;

  constructor(types: Array<Iri> = []) {
    super(`Article type must be http://schema.org/Article (${types.length ? `'${types.join(', ')}'` : 'none'} was given)`);

    this.types = types;
  }
}
