import { JsonLdObj } from 'jsonld/jsonld-spec';
import { BlankNode } from 'rdf-js';

interface Articles extends AsyncIterable<[BlankNode, JsonLdObj]> {
  set(id: BlankNode, article: JsonLdObj): Promise<void>;

  get(id: BlankNode): Promise<JsonLdObj>;

  remove(id: BlankNode): Promise<void>;

  contains(id: BlankNode): Promise<boolean>;

  count(): Promise<number>;
}

export default Articles;
