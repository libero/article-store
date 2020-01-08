import { JsonLdObj } from 'jsonld/jsonld-spec';
import { schema } from 'rdf-namespaces';
import { IBaseProtocol, IMain } from 'pg-promise';
import { BlankNode, Term } from 'rdf-js';
import { termToString, stringToTerm } from 'rdf-string';
import Articles from '../articles';
import ArticleNotFound from '../errors/article-not-found';
import NotAnArticle from '../errors/not-an-article';

export default class PostgresArticles implements Articles {
  private database: IBaseProtocol<IMain>;

  public constructor(database: IBaseProtocol<IMain>) {
    this.database = database;
  }

  async set(id: BlankNode, article: JsonLdObj): Promise<void> {
    const types = [].concat(article['@type'] || []);

    if (!(types.includes(schema.Article)) || article['@id'] !== termToString(id)) {
      throw new NotAnArticle(types.map((type: string): Term => stringToTerm(type)));
    }

    await this.database.none('INSERT INTO articles(uuid, article) VALUES ($[uuid], $[article]) ON CONFLICT (uuid) DO UPDATE SET article = $[article]', {
      uuid: id.value,
      article,
    });
  }

  async get(id: BlankNode): Promise<JsonLdObj> {
    return this.database.oneOrNone('SELECT article FROM articles WHERE uuid = $[uuid]', { uuid: id.value }, (data: { article: JsonLdObj } | null) => {
      if (!data) {
        throw new ArticleNotFound(id);
      }

      return data.article;
    });
  }

  async remove(id: BlankNode): Promise<void> {
    await this.database.none('DELETE FROM articles WHERE uuid = $[uuid]', { uuid: id.value });
  }

  async contains(id: BlankNode): Promise<boolean> {
    return this.database.one('SELECT COUNT(*) FROM articles WHERE uuid = $[uuid]', { uuid: id.value }, (data: { count: number }) => +data.count > 0);
  }

  async count(): Promise<number> {
    return this.database.one('SELECT COUNT(*) FROM articles', [], (data: { count: number }) => +data.count);
  }

  async* [Symbol.asyncIterator](): AsyncIterator<[BlankNode, JsonLdObj]> {
    yield* await this.database.any('SELECT article FROM articles').then((rows) => rows.map((row) => [stringToTerm(row.article['@id']), row.article])) as [[BlankNode, JsonLdObj]];
  }
}
