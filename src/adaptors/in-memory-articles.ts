import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';
import Articles from '../articles';
import ArticleHasNoId from '../errors/article-has-no-id';
import ArticleNotFound from '../errors/article-not-found';

export default class InMemoryArticles implements Articles {
  private nodes: { [key: string]: JsonLdObj } = {};

  async add(node: JsonLdObj): Promise<void> {
    if (!('@id' in node)) {
      throw new ArticleHasNoId();
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
