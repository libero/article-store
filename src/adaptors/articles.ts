import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';

export default interface Articles extends Iterable<JsonLdObj> {
    count(): Promise<number>;

    get(id: Iri): Promise<JsonLdObj>;

    set(article: JsonLdObj): Promise<void>;

    delete(id: Iri): Promise<void>;

    has(id: Iri): Promise<boolean>;
}
