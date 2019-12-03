import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';
import uniqueString from 'unique-string';
import Articles from '../articles';
import ArticleNotFound from '../errors/article-not-found';

type IdGenerator = (id: string) => Iri;

export default class InMemoryArticles implements Articles {
  private articles: { [key: string]: JsonLdObj } = {};

  private readonly idGenerator: IdGenerator;

  constructor(idGenerator: IdGenerator) {
    this.idGenerator = idGenerator;
  }

  async add(article: JsonLdObj): Promise<void> {
    const data = article;
    if (!('@id' in data)) {
      data['@id'] = this.idGenerator(uniqueString());
    }

    this.articles[data['@id']] = data;
  }

  async get(id: Iri): Promise<JsonLdObj> {
    if (!(id in this.articles)) {
      throw new ArticleNotFound(id);
    }

    return this.articles[id];
  }

  async remove(id: Iri): Promise<void> {
    delete this.articles[id];
  }

  async contains(id: Iri): Promise<boolean> {
    return id in this.articles;
  }

  async count(): Promise<number> {
    return Object.values(this.articles).length;
  }

  * [Symbol.iterator](): Iterator<JsonLdObj> {
    yield* Object.values(this.articles);
  }
}
