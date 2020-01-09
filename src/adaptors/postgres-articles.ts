import { IBaseProtocol, IMain } from 'pg-promise';
import {
  BlankNode, DatasetCore, Quad, Quad_Object as QuadObject,
} from 'rdf-js';
import { stringToTerm } from 'rdf-string';
import ParserJsonld from '@rdfjs/parser-jsonld';
import SerializerJsonld from '@rdfjs/serializer-jsonld-ext';
import pEvent from 'p-event';
import { fromStream, toStream } from 'rdf-dataset-ext';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import toReadableStream from 'to-readable-stream';
import createDataset from 'rdf-dataset-indexed';
import Articles from '../articles';
import ArticleNotFound from '../errors/article-not-found';
import NotAnArticle from '../errors/not-an-article';
import { rdf, schema } from '../namespaces';

export default class PostgresArticles implements Articles {
  private database: IBaseProtocol<IMain>;

  public constructor(database: IBaseProtocol<IMain>) {
    this.database = database;
  }

  async set(id: BlankNode, article: DatasetCore): Promise<void> {
    if (article.match(id, rdf.type, schema.Article).size === 0) {
      throw new NotAnArticle([...article.match(id, rdf.type)].map((quad: Quad): QuadObject => quad.object));
    }

    await this.database.none('INSERT INTO articles(uuid, article) VALUES ($[uuid], $[article]) ON CONFLICT (uuid) DO UPDATE SET article = $[article]', {
      uuid: id.value,
      article: (await pEvent((new SerializerJsonld()).import(toStream(article)), 'data'))[0],
    });
  }

  async get(id: BlankNode): Promise<DatasetCore> {
    return this.database.oneOrNone('SELECT article FROM articles WHERE uuid = $[uuid]', { uuid: id.value }, async (data: { article: JsonLdObj } | null) => {
      if (!data) {
        throw new ArticleNotFound(id);
      }

      return fromStream(createDataset(), (new ParserJsonld()).import(toReadableStream(JSON.stringify(data.article))));
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

  async* [Symbol.asyncIterator](): AsyncIterator<[BlankNode, DatasetCore]> {
    yield* await this.database.any('SELECT article FROM articles').then((rows) => rows.map(async (row) => [stringToTerm(row.article['@id']), fromStream(createDataset(), (new ParserJsonld()).import(toReadableStream(JSON.stringify(row.article))))])) as [[BlankNode, DatasetCore]];
  }
}
