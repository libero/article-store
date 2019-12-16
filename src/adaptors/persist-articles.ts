import { Iri, JsonLdObj, JsonLdArray } from 'jsonld/jsonld-spec';
import { schema } from 'rdf-namespaces';
import { IDatabase } from 'pg-promise';
import uuidv4 from 'uuid/v4';
import Articles from '../articles';
import ArticleHasNoId from '../errors/article-has-no-id';
import ArticleNotFound from '../errors/article-not-found';
import NotAnArticle from '../errors/not-an-article';

export default class PersistArticles implements Articles {
  private db: IDatabase<{}>;

  public constructor(db: IDatabase<{}>) {
    this.db = db;
  }

  async add(article: JsonLdObj): Promise<void> {
    const types = [].concat(article['@type'] || []);

    if (!(types.includes(schema.Article))) {
      throw new NotAnArticle(types);
    }

    if (!('@id' in article)) {
      throw new ArticleHasNoId();
    }

    this.db.none('INSERT INTO articles(uuid, article) VALUES ($[uuid], $[article])', {
      uuid: uuidv4(),
      article,
    });
  }

  async get(id: Iri): Promise<JsonLdObj> {
    const article = this.db.one('SELECT article FROM articles WHERE uuid = $[id]', { id }, (data: { article: JsonLdObj }) => data.article);
    if (!article) {
      throw new ArticleNotFound(id);
    }

    return article;
  }

  async remove(id: Iri): Promise<void> {
    this.db.none('DELETE FROM articles WHERE uuid = $[id]', { id });
  }

  async contains(id: Iri): Promise<boolean> {
    return this.db.one('SELECT COUNT(*) FROM articles WHERE uuid = $[id]', { id }, (data: { count: number }) => +data.count > 0);
  }

  async count(): Promise<number> {
    return this.db.one('SELECT COUNT(*) FROM articles', [], (data: { count: number }) => +data.count);
  }

  async* [Symbol.asyncIterator](): AsyncIterator<JsonLdObj> {
    yield* await this.db.any('SELECT article FROM articles').then((rows) => rows.map((row) => row.article)) as JsonLdArray;
  }
}
