import ParserJsonld from '@rdfjs/parser-jsonld';
import SerializerJsonld from '@rdfjs/serializer-jsonld-ext';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import pEvent from 'p-event';
import { errors, IBaseProtocol, IMain } from 'pg-promise';
import { fromStream, toStream } from 'rdf-dataset-ext';
import {
  DatasetCore, DatasetCoreFactory, NamedNode, Quad, Quad_Object as QuadObject,
} from 'rdf-js';
import { stringToTerm, termToString } from 'rdf-string';
import toReadableStream from 'to-readable-stream';
import Articles from '../articles';
import ArticleNotFound from '../errors/article-not-found';
import NotAnArticle from '../errors/not-an-article';
import { ExtendedDataFactory } from '../middleware/dataset';
import { rdf, schema } from '../namespaces';

const { QueryResultError, queryResultErrorCode: { noData } } = errors;

export default class PostgresArticles implements Articles {
  private database: IBaseProtocol<IMain>;

  private datasetFactory: DatasetCoreFactory;

  private parser: ParserJsonld;

  private serializer: SerializerJsonld;

  public constructor(database: IBaseProtocol<IMain>, dataFactory: ExtendedDataFactory) {
    this.database = database;
    this.datasetFactory = dataFactory;
    this.parser = new ParserJsonld({
      factory: dataFactory,
    });
    this.serializer = new SerializerJsonld();
  }

  async set(id: NamedNode, article: DatasetCore): Promise<void> {
    if (article.match(id, rdf.type, schema.Article).size === 0) {
      throw new NotAnArticle([...article.match(id, rdf.type)].map((quad: Quad): QuadObject => quad.object));
    }

    const values = {
      iri: termToString(id),
      article: await this.toObject(article),
    };

    await this.database.none('INSERT INTO articles(iri, article) VALUES ($[iri], $[article]) ON CONFLICT (iri) DO UPDATE SET article = $[article]', values);
  }

  async get(id: NamedNode): Promise<DatasetCore> {
    const values = { iri: termToString(id) };
    const callback = ({ article }: { article: string }): string => article;

    let article: string;

    try {
      article = await this.database.one('SELECT article::text FROM articles WHERE iri = $[iri]', values, callback);
    } catch (error) {
      if (!(error instanceof QueryResultError) || error.code !== noData) {
        throw error;
      }

      throw new ArticleNotFound(id);
    }

    return this.toDataset(article);
  }

  async remove(id: NamedNode): Promise<void> {
    const values = { iri: termToString(id) };

    await this.database.none('DELETE FROM articles WHERE iri = $[iri]', values);
  }

  async contains(id: NamedNode): Promise<boolean> {
    const values = { iri: termToString(id) };
    const callback = ({ contains }: { contains: boolean }): boolean => contains;

    return this.database.one('SELECT EXISTS(SELECT 1 FROM articles WHERE iri = $[iri]) AS contains', values, callback);
  }

  async count(): Promise<number> {
    const callback = ({ count }: { count: string }): number => +count;

    return this.database.one('SELECT COUNT(*) FROM articles', [], callback);
  }

  async* [Symbol.asyncIterator](): AsyncIterator<[NamedNode, DatasetCore]> {
    yield* await this.database.map('SELECT iri, article::text FROM articles', [], this.toTuple, this);
  }

  static async setupTable(database: IBaseProtocol<IMain>): Promise<void> {
    await database.none('DROP TABLE IF EXISTS articles');
    await database.none(`CREATE TABLE IF NOT EXISTS articles (
      iri varchar (128) NOT NULL UNIQUE,
      article jsonb NOT NULL
    )`);
  }

  private async toObject(article: DatasetCore): Promise<JsonLdObj> {
    return (await pEvent(this.serializer.import(toStream(article)), 'data'))[0];
  }

  private async toDataset(article: string): Promise<DatasetCore> {
    return fromStream(this.datasetFactory.dataset(), this.parser.import(toReadableStream(article)));
  }

  private async toTuple({ iri, article }: { iri: string; article: string }): Promise<[NamedNode, DatasetCore]> {
    return [
      stringToTerm(iri),
      await this.toDataset(article),
    ] as [NamedNode, DatasetCore];
  }
}
