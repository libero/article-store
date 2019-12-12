import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';

interface Articles extends AsyncIterable<JsonLdObj> {
  add(article: JsonLdObj): Promise<void>;

  get(id: Iri): Promise<JsonLdObj>;

  remove(id: Iri): Promise<void>;

  contains(id: Iri): Promise<boolean>;

  count(): Promise<number>;
}

export default Articles;
