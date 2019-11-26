import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';

export interface Nodes extends AsyncIterable<JsonLdObj> {
    count(): Promise<number>;

    get(id: Iri): Promise<JsonLdObj>;

    set(article: JsonLdObj): Promise<void>;

    delete(id: Iri): Promise<void>;

    has(id: Iri): Promise<boolean>;
}

export default class InMemoryNodes implements Nodes {
    private nodes: { [key: string]: JsonLdObj } = {};

    private i = 0;

    [Symbol.asyncIterator](): AsyncIterator<JsonLdObj> {
      const isDone = Object.keys(this.nodes)[this.i] === undefined;
      const article = !isDone ? this.nodes[Object.keys(this.nodes)[this.i]] : undefined;
      this.i += 1;
      return {
        next(): Promise<IteratorResult<JsonLdObj>> {
          return Promise.resolve({
            done: isDone,
            value: article,
          });
        },
      };
    }

    async count(): Promise<number> {
      return Object.values(this.nodes).length;
    }

    async get(id: Iri): Promise<JsonLdObj> {
      return this.nodes[id];
    }

    async set(node: JsonLdObj): Promise<void> {
      this.nodes[node['@id']] = node;
    }

    async delete(id: Iri): Promise<void> {
      delete this.nodes[id];
    }

    async has(id: Iri): Promise<boolean> {
      return id in this.nodes;
    }
}
