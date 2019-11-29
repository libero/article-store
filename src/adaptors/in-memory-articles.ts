import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';
import Articles from '../articles';
import ArticleNotFound from '../errors/article-not-found';

export default class InMemoryArticles implements Articles {
  private nodes: { [key: string]: JsonLdObj } = {};

  * [Symbol.iterator](): Iterator<JsonLdObj> {
    yield* Object.values<JsonLdObj>(this.nodes);
  }

  async count(): Promise<number> {
    return Object.values(this.nodes).length;
  }

  async get(id: Iri): Promise<JsonLdObj> {
    if (!this.has(id)) {
      throw new ArticleNotFound(id);
    }

    return this.nodes[id];
  }

  async add(node: JsonLdObj): Promise<void> {
    this.nodes[node['@id']] = node;
  }

  async delete(id: Iri): Promise<void> {
    delete this.nodes[id];
  }

  async has(id: Iri): Promise<boolean> {
    return id in this.nodes;
  }
}
