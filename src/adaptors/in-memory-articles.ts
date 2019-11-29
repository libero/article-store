import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';
import Articles from '../articles';
import ArticleNotFound from '../errors/article-not-found';
import InvalidId from '../errors/invalid-id';

export default class InMemoryArticles implements Articles {
  private nodes: { [key: string]: JsonLdObj } = {};

  async add(node: JsonLdObj): Promise<void> {
    if (node['@id'] === undefined) {
      throw new InvalidId();
    }
    this.nodes[node['@id']] = node;
  }

  async get(id: Iri): Promise<JsonLdObj> {
    if (!(id in this.nodes)) {
      throw new ArticleNotFound(id);
    }

    return this.nodes[id];
  }

  async remove(id: Iri): Promise<void> {
    delete this.nodes[id];
  }

  async contains(id: Iri): Promise<boolean> {
    return id in this.nodes;
  }

  async count(): Promise<number> {
    return Object.values(this.nodes).length;
  }

  * [Symbol.iterator](): Iterator<JsonLdObj> {
    yield* Object.values(this.nodes);
  }
}
