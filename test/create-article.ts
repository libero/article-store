import deepFilter from 'deep-filter';
import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';

const isNotUndefined = (arg: unknown): boolean => arg !== undefined;

export default (id?: Iri, name = `Article ${id}`): JsonLdObj => (
  deepFilter({
    '@id': id,
    '@type': 'http://schema.org/Article',
    'http://schema.org/name': name,
  }, isNotUndefined)
);
