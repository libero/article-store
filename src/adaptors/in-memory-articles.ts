import { JsonLdObj, Iri } from 'jsonld/jsonld-spec';
import Articles from './articles';

export default class InMemoryArticles implements Articles {
    private nodes: { [key: string]: JsonLdObj } = {};

    [Symbol.asyncIterator](): AsyncIterator<JsonLdObj> {
      const { nodes } = this;
      let i = 0;
      return {
        next(): Promise<IteratorResult<JsonLdObj>> {
          const iri = Object.keys(nodes)[i];
          const isDone = iri === undefined;
          const article = !isDone ? nodes[iri] : undefined;
          i += 1;
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
      if (this.has(id)) {
        return this.nodes[id];
      }
      throw new RangeError();
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
