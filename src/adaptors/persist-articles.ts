import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';
import { schema } from 'rdf-namespaces';
import Knex from 'knex';
import Articles from '../articles';
import ArticleHasNoId from '../errors/article-has-no-id';
import ArticleNotFound from '../errors/article-not-found';
import NotAnArticle from '../errors/not-an-article';

export default class PersistArticles implements Articles {
  private readonly knex: Knex<{}, unknown[]>;

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
    const article = await this.knex('article-store').select('article').where({ uuid: id.substring(2) }).first().then(row => row ? row.article : row);
    if (article === undefined) {
      throw new ArticleNotFound(id);
    }

    return article;
  }

  async remove(id: Iri): Promise<void> {
    await this.knex('article-store').where({ uuid: id.substring(2) }).del();
  }

  async contains(id: Iri): Promise<boolean> {
    return await this.knex('article-store').where({ uuid: id.substring(2) }).first().then(row => row ? true : false);
  }

  async count(): Promise<number> {
    return await this.knex('article-store').count().first().then(total => parseInt(total.count.toString()));
  }

  async* [Symbol.asyncIterator](): AsyncIterator<JsonLdObj> {
    yield* (await this.knex('article-store').select('article')).map(item => {
      return item.article;
    });
  }
}
