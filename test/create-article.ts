import deepFilter from 'deep-filter';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import { BlankNode } from 'rdf-js';
import { termToString } from 'rdf-string';

const isNotUndefined = (arg: unknown): boolean => arg !== undefined;

export default (id?: BlankNode, name = id ? `Article ${id}` : 'Article'): JsonLdObj => (
  deepFilter({
    '@id': id ? termToString(id) : undefined,
    '@type': 'http://schema.org/Article',
    'http://schema.org/name': name,
  }, isNotUndefined)
);
