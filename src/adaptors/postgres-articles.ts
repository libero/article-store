import { IBaseProtocol, IMain } from 'pg-promise';
import {
  BlankNode, DatasetCore, Quad, Quad_Object as QuadObject, Sink,
} from 'rdf-js';
import { stringToTerm, termToString } from 'rdf-string';
import ParserJsonld from '@rdfjs/parser-jsonld';
import SerializerJsonld from '@rdfjs/serializer-jsonld-ext';
import pEvent from 'p-event';
import { fromStream, toStream } from 'rdf-dataset-ext';
import toReadableStream from 'to-readable-stream';
import Articles from '../articles';
import ArticleNotFound from '../errors/article-not-found';
import NotAnArticle from '../errors/not-an-article';
import { rdf, schema } from '../namespaces';
import { ExtendedDataFactory } from '../middleware/dataset';

export default class PostgresArticles implements Articles {
  private database: IBaseProtocol<IMain>;

  private dataFactory: ExtendedDataFactory;

  private parser: Sink;

  private serialiser: Sink;

  public constructor(database: IBaseProtocol<IMain>, dataFactory: ExtendedDataFactory) {
    this.database = database;
    this.dataFactory = dataFactory;
    this.parser = new ParserJsonld({
      factory: dataFactory,
    });
    this.serialiser = new SerializerJsonld();
  }

  async set(id: BlankNode, article: DatasetCore): Promise<void> {
    if (article.match(id, rdf.type, schema.Article).size === 0) {
      throw new NotAnArticle([...article.match(id, rdf.type)].map((quad: Quad): QuadObject => quad.object));
    }

    await this.database.none('INSERT INTO articles(uuid, article) VALUES ($[uuid], $[article]) ON CONFLICT (uuid) DO UPDATE SET article = $[article]', {
      uuid: termToString(id),
      article: JSON.stringify(await pEvent(this.serialiser.import(toStream(article)), 'data')),
    });
  }

  async get(id: BlankNode): Promise<DatasetCore> {
    const article = await this.database.oneOrNone('SELECT article FROM articles WHERE uuid = $[uuid]', { uuid: termToString(id) }, async (data: { article: string } | null): Promise<string | null> => (
      (data) ? data.article : data
    ));

    if (!article) {
      throw new ArticleNotFound(id);
    }

    return fromStream(this.dataFactory.dataset(), this.parser.import(toReadableStream(article)));
  }

  async remove(id: BlankNode): Promise<void> {
    await this.database.none('DELETE FROM articles WHERE uuid = $[uuid]', { uuid: termToString(id) });
  }

  async contains(id: BlankNode): Promise<boolean> {
    return this.database.one('SELECT COUNT(*) FROM articles WHERE uuid = $[uuid]', { uuid: termToString(id) }, (data: { count: number }) => +data.count > 0);
  }

  async count(): Promise<number> {
    return this.database.one('SELECT COUNT(*) FROM articles', [], (data: { count: number }) => +data.count);
  }

  async* [Symbol.asyncIterator](): AsyncIterator<[BlankNode, DatasetCore]> {
    yield* await this.database.any('SELECT uuid, article FROM articles').then((rows) => rows.map(async (row: { uuid: string; article: string }) => [stringToTerm(row.uuid), await fromStream(this.dataFactory.dataset(), this.parser.import(toReadableStream(row.article)))])) as [[BlankNode, DatasetCore]];
  }

  static async createTables(database: IBaseProtocol<IMain>): Promise<void> {
    await database.none('DROP TABLE IF EXISTS articles');
    await database.none(`CREATE TABLE IF NOT EXISTS articles (
      uuid varchar (34) NOT NULL UNIQUE,
      article text NOT NULL,
      created time without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`);
  }
}
