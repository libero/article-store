import { JsonLdObj, Iri } from 'jsonld/jsonld-spec';
import Articles from './articles';

export default class InMemoryArticles implements Articles {
    private nodes: { [key: string]: JsonLdObj } = {};

    * [Symbol.iterator](): Iterator<JsonLdObj> {
      yield* Object.values<JsonLdObj>(this.nodes);
    }

    async count(): Promise<number> {
      return Object.values(this.nodes).length;
    }

    async get(id: Iri): Promise<JsonLdObj> {
      if (this.has(id)) {
        return this.nodes[id];
      }
      throw new RangeError(`An item with the ID ${id} could not be found`);
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
