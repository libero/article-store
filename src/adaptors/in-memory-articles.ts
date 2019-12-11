import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';
import { schema } from 'rdf-namespaces';
import Articles from '../articles';
import ArticleHasNoId from '../errors/article-has-no-id';
import ArticleNotFound from '../errors/article-not-found';
import NotAnArticle from '../errors/not-an-article';

export default class InMemoryArticles implements Articles {
  private articles: { [key: string]: JsonLdObj } = {};

  async add(article: JsonLdObj): Promise<void> {
    const types = [].concat(article['@type'] || []);

    if (!(types.includes(schema.Article))) {
      throw new NotAnArticle(types);
    }

    if (!('@id' in article)) {
      throw new ArticleHasNoId();
    }

    this.articles[article['@id']] = article;
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
