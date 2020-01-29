import { IBaseProtocol, IMain } from 'pg-promise';
import {
  DatasetCore, NamedNode, Quad, Quad_Object as QuadObject,
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

export default class PostgresArticles implements Articles {
  private database: IBaseProtocol<IMain>;

  private dataFactory: ExtendedDataFactory;

  private parser: ParserJsonld;

  private serializer: SerializerJsonld;

  public constructor(database: IBaseProtocol<IMain>, dataFactory: ExtendedDataFactory) {
    this.database = database;
    this.dataFactory = dataFactory;
    this.parser = new ParserJsonld({
      factory: dataFactory,
    });
    this.serializer = new SerializerJsonld();
  }

  async set(id: NamedNode, article: DatasetCore): Promise<void> {
    if (article.match(id, rdf.type, schema.Article).size === 0) {
      throw new NotAnArticle([...article.match(id, rdf.type)].map((quad: Quad): QuadObject => quad.object));
    }

    await this.database.none('INSERT INTO articles(iri, article) VALUES ($[iri], $[article]) ON CONFLICT (iri) DO UPDATE SET article = $[article]', {
      iri: id.value,
      article: (await pEvent(this.serializer.import(toStream(article)), 'data'))[0],
    });
  }

  async get(id: NamedNode): Promise<DatasetCore> {
    const article = await this.database.oneOrNone('SELECT article::text FROM articles WHERE iri = $[iri]', { iri: id.value }, (data: { article: string } | null) => (
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
    return this.database.one('SELECT EXISTS(SELECT 1 FROM articles WHERE iri = $[iri]) AS contains', { iri: id.value }, (data: { contains: boolean }) => data.contains);
  }

  async count(): Promise<number> {
    return this.database.one('SELECT COUNT(*) FROM articles', [], (data: { count: string }) => +data.count);
  }

  async* [Symbol.asyncIterator](): AsyncIterator<[NamedNode, DatasetCore]> {
    yield* await this.database.any('SELECT iri, article::text FROM articles').then((rows) => rows.map(async (row: { iri: string; article: string }) => [this.dataFactory.namedNode(row.iri), await fromStream(this.dataFactory.dataset(), this.parser.import(toReadableStream(row.article)))])) as [[NamedNode, DatasetCore]];
  }

  static async setupTable(database: IBaseProtocol<IMain>): Promise<void> {
    await database.none('DROP TABLE IF EXISTS articles');
    await database.none(`CREATE TABLE IF NOT EXISTS articles (
      iri varchar (128) NOT NULL UNIQUE,
      article jsonb NOT NULL
    )`);
  }
}
