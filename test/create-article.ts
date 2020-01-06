import { namedNode } from '@rdfjs/data-model';
import deepFilter from 'deep-filter';
import { Options } from 'jsonld';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import { BlankNode, NamedNode } from 'rdf-js';
import { termToString } from 'rdf-string';

const isNotUndefined = (arg: unknown): boolean => arg !== undefined;

type Options = {
  id?: BlankNode;
  name?: string;
  types?: Array<NamedNode>;
}

export default ({
  id = undefined,
  name = 'Article',
  types = [namedNode('http://schema.org/Article')],
}: Options = {}): JsonLdObj => (
  deepFilter({
    '@id': id ? termToString(id) : undefined,
    '@type': types.map(termToString),
    'http://schema.org/name': name,
  }, isNotUndefined)
);
