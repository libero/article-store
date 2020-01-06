import { JsonLdObj } from 'jsonld/jsonld-spec';
import { BlankNode, Term } from 'rdf-js';
import { schema } from 'rdf-namespaces';
import { stringToTerm, termToString } from 'rdf-string';
import Articles from '../articles';
import ArticleNotFound from '../errors/article-not-found';
import NotAnArticle from '../errors/not-an-article';

export default class InMemoryArticles implements Articles {
  private articles: { [id: string]: [BlankNode, JsonLdObj] } = {};

  async set(id: BlankNode, article: JsonLdObj): Promise<void> {
    const types = [].concat(article['@type'] || []);

    if (!(types.includes(schema.Article)) || article['@id'] !== termToString(id)) {
      throw new NotAnArticle(types.map((type: string): Term => stringToTerm(type)));
    }

    this.articles[id.value] = [id, article];
  }

  async get(id: BlankNode): Promise<JsonLdObj> {
    if (!(id.value in this.articles)) {
      throw new ArticleNotFound(id);
    }

    return this.articles[id.value][1];
  }

  async remove(id: BlankNode): Promise<void> {
    delete this.articles[id.value];
  }

  async contains(id: BlankNode): Promise<boolean> {
    return id.value in this.articles;
  }

  async count(): Promise<number> {
    return Object.values(this.articles).length;
  }

  async* [Symbol.asyncIterator](): AsyncIterator<[BlankNode, JsonLdObj]> {
    yield* Object.values(this.articles);
  }
}
