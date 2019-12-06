import deepFilter from 'deep-filter';
import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';

const isNotUndefined = (arg: unknown): boolean => arg !== undefined;

export default (id?: Iri, name = id ? `Article ${id}` : 'Article'): JsonLdObj => (
  deepFilter({
    '@id': id,
    '@type': 'http://schema.org/Article',
    'http://schema.org/name': name,
  }, isNotUndefined)
);
