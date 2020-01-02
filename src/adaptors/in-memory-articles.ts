import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';
import { schema } from 'rdf-namespaces';
import Articles from '../articles';
import ArticleNotFound from '../errors/article-not-found';
import NotAnArticle from '../errors/not-an-article';

export default class InMemoryArticles implements Articles {
  private articles: { [key: string]: [Iri, JsonLdObj] } = {};

  async set(id: Iri, article: JsonLdObj): Promise<void> {
    const types = [].concat(article['@type'] || []);

    if (!(types.includes(schema.Article)) || article['@id'] !== id) {
      throw new NotAnArticle(types);
    }

    this.articles[id] = [id, article];
  }

  async get(id: Iri): Promise<JsonLdObj> {
    if (!(id in this.articles)) {
      throw new ArticleNotFound(id);
    }

    return this.articles[id][1];
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

  async* [Symbol.asyncIterator](): AsyncIterator<[Iri, JsonLdObj]> {
    yield* Object.values(this.articles);
  }
}
