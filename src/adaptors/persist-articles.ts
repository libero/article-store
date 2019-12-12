import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';
import { schema } from 'rdf-namespaces';
import Knex from 'knex';
import Articles from '../articles';
import ArticleHasNoId from '../errors/article-has-no-id';
import ArticleNotFound from '../errors/article-not-found';
import NotAnArticle from '../errors/not-an-article';

export default class PersistArticles implements Articles {
  private readonly knex: Knex<{}, unknown[]>;

  private articles: { [key: string]: JsonLdObj } = {};

  public constructor(knex: Knex<{}, unknown[]>) {
    this.knex = knex;
  }

  async add(article: JsonLdObj): Promise<void> {
    const types = [].concat(article['@type'] || []);

    if (!(types.includes(schema.Article))) {
      throw new NotAnArticle(types);
    }

    if (!('@id' in article)) {
      throw new ArticleHasNoId();
    }

    await this.knex('article-store').insert({
      uuid: article['@id'].substring(2),
      article,
    });
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
    const [count] = await this.knex('article-store').count();
    return count.count;
  }

  * [Symbol.iterator](): Iterator<JsonLdObj> {
    yield* Object.values(this.articles);
  }
}
