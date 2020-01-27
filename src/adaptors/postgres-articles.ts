import { EventEmitter } from 'events';
import { IBaseProtocol, IMain } from 'pg-promise';
import {
  DatasetCore, NamedNode, Quad, Quad_Object as QuadObject, Sink, Stream,
} from 'rdf-js';
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
import { namedNode } from '../data-factory';

export default class PostgresArticles implements Articles {
  private database: IBaseProtocol<IMain>;

  private dataFactory: ExtendedDataFactory;

  private parser: Sink<Stream<Quad>, Stream<Quad>>;

  private serialiser: Sink<Stream<Quad>, EventEmitter>;

  public constructor(database: IBaseProtocol<IMain>, dataFactory: ExtendedDataFactory) {
    this.database = database;
    this.dataFactory = dataFactory;
    this.parser = new ParserJsonld({
      factory: dataFactory,
    });
    this.serialiser = new SerializerJsonld();
  }

  async set(id: NamedNode, article: DatasetCore): Promise<void> {
    if (article.match(id, rdf.type, schema.Article).size === 0) {
      throw new NotAnArticle([...article.match(id, rdf.type)].map((quad: Quad): QuadObject => quad.object));
    }

    await this.database.none('INSERT INTO articles(iri, article) VALUES ($[iri], $[article]) ON CONFLICT (iri) DO UPDATE SET article = $[article]', {
      iri: id.value,
      article: JSON.stringify(await pEvent(this.serialiser.import(toStream(article)), 'data')),
    });
  }

  async get(id: NamedNode): Promise<DatasetCore> {
    const article = await this.database.oneOrNone('SELECT article FROM articles WHERE iri = $[iri]', { iri: id.value }, (data: { article: string } | null) => (
      (data) ? data.article : data
    ));

    if (!article) {
      throw new ArticleNotFound(id);
    }

    return fromStream(this.dataFactory.dataset(), this.parser.import(toReadableStream(article)));
  }

  async remove(id: NamedNode): Promise<void> {
    await this.database.none('DELETE FROM articles WHERE iri = $[iri]', { iri: id.value });
  }

  async contains(id: NamedNode): Promise<boolean> {
    return this.database.one('SELECT COUNT(*) FROM articles WHERE iri = $[iri]', { iri: id.value }, (data: { count: number }) => +data.count > 0);
  }

  async count(): Promise<number> {
    return this.database.one('SELECT COUNT(*) FROM articles', [], (data: { count: number }) => +data.count);
  }

  async* [Symbol.asyncIterator](): AsyncIterator<[NamedNode, DatasetCore]> {
    yield* await this.database.any('SELECT iri, article FROM articles').then((rows) => rows.map(async (row: { iri: string; article: string }) => [namedNode(row.iri), await fromStream(this.dataFactory.dataset(), this.parser.import(toReadableStream(row.article)))])) as [[NamedNode, DatasetCore]];
  }

  static async createTables(database: IBaseProtocol<IMain>): Promise<void> {
    await database.none('DROP TABLE IF EXISTS articles');
    await database.none(`CREATE TABLE IF NOT EXISTS articles (
      iri varchar (128) NOT NULL UNIQUE,
      article text NOT NULL
    )`);
  }
}
