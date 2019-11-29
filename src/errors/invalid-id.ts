import { Iri } from 'jsonld/jsonld-spec';

export default class InvalidId extends Error {
  readonly id: Iri;

  constructor(id?: Iri) {
    super(`${id} is not a valid ID`);

    this.id = id;
  }
}
