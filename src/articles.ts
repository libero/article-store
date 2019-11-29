import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';

interface Articles extends Iterable<JsonLdObj> {
    count(): Promise<number>;

    get(id: Iri): Promise<JsonLdObj>;

    add(article: JsonLdObj): Promise<void>;

    delete(id: Iri): Promise<void>;

    has(id: Iri): Promise<boolean>;
}

export default Articles;
