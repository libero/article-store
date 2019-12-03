import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';

export default (id: Iri, name = `Article ${id}`): JsonLdObj => ({
  '@id': id,
  '@type': 'http://schema.org/Article',
  'http://schema.org/name': name,
});
