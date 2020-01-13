import { blankNode, literal, quad } from '@rdfjs/data-model';
import all from 'it-all';
import 'jest-rdf';
import { BlankNode, DatasetCore } from 'rdf-js';
import pgPromise, { IBaseProtocol, IMain } from 'pg-promise';
import PostgresArticles from '../../src/adaptors/postgres-articles';
import ArticleNotFound from '../../src/errors/article-not-found';
import NotAnArticle from '../../src/errors/not-an-article';
import { schema } from '../../src/namespaces';
import createArticle from '../create-article';
import db from '../../src/db';
import dataFactory from '../../src/data-factory';

let pgp: IMain;
let database: IBaseProtocol<IMain>;

beforeAll(async (): Promise<void> => {
  pgp = pgPromise();
  database = pgp(db);
  await PostgresArticles.createTables(database);
});

afterAll((): void => {
  pgp.end();
});

describe('postgres articles #integration', (): void => {
  beforeEach(async (): Promise<void> => {
    await database.none('TRUNCATE articles');
  });

  it('can add an article', async (): Promise<void> => {
    const articles = new PostgresArticles(database, dataFactory);
    const id = blankNode();

    expect(await articles.contains(id)).toBe(false);

    await articles.set(id, createArticle({ id }));

    expect(await articles.contains(id)).toBe(true);
  });

  it('can add an article with multiple types', async (): Promise<void> => {
    const articles = new PostgresArticles(database, dataFactory);
    const id = blankNode();
    const article = createArticle({ id, types: [schema.Article, schema.NewsArticle] });

    await articles.set(id, article);

    expect(await articles.contains(id)).toBe(true);
  });

  it('can update an article', async (): Promise<void> => {
    const articles = new PostgresArticles(database, dataFactory);
    const id = blankNode();

    await articles.set(id, createArticle({ id, name: literal('Original') }));
    await articles.set(id, createArticle({ id, name: literal('Updated') }));

    expect((await articles.get(id)).has(quad(id, schema('name'), literal('Updated')))).toBe(true);
  });

  it('throws an error if it is not an article', async (): Promise<void> => {
    const articles = new PostgresArticles(database, dataFactory);
    const id = blankNode();
    const article = createArticle({ id, types: [schema.NewsArticle] });

    await expect(articles.set(id, article)).rejects.toThrow(new NotAnArticle([schema.NewsArticle]));
  });

  it('throws an error if it has no type', async (): Promise<void> => {
    const articles = new PostgresArticles(database, dataFactory);
    const id = blankNode();
    const article = createArticle({ id, types: [] });

    await expect(articles.set(id, article)).rejects.toThrow(new NotAnArticle());
  });

  it('can retrieve an article', async (): Promise<void> => {
    const articles = new PostgresArticles(database, dataFactory);
    const id = blankNode();
    const article = createArticle({ id });

    await articles.set(id, article);

    expect([...await articles.get(id)]).toEqualRdfQuadArray([...article]);
  });

  it('throws an error if the article is not found', async (): Promise<void> => {
    const articles = new PostgresArticles(database, dataFactory);
    const id = blankNode();

    await expect(articles.get(id)).rejects.toBeInstanceOf(ArticleNotFound);
    await expect(articles.get(id)).rejects.toHaveProperty('id', id);
  });

  it('can remove an article', async (): Promise<void> => {
    const articles = new PostgresArticles(database, dataFactory);
    const id = blankNode();

    await articles.set(id, createArticle({ id }));
    await articles.remove(id);

    expect(await articles.contains(id)).toBe(false);
  });

  it('does nothing when trying to remove an article that is not there', async (): Promise<void> => {
    const articles = new PostgresArticles(database, dataFactory);
    const id = blankNode();

    await expect(articles.remove(id)).resolves.not.toThrow();
  });

  it('can count the number of articles', async (): Promise<void> => {
    const articles = new PostgresArticles(database, dataFactory);

    expect(await articles.count()).toBe(0);

    const id1 = blankNode();
    const id2 = blankNode();

    await articles.set(id1, createArticle({ id: id1 }));
    await articles.set(id2, createArticle({ id: id2 }));
    await articles.set(id2, createArticle({ id: id2 }));

    expect(await articles.count()).toBe(2);
  });

  it('can iterate through the articles', async (): Promise<void> => {
    const articles = new PostgresArticles(database, dataFactory);

    const id1 = blankNode();
    const id2 = blankNode();
    const id3 = blankNode();

    await articles.set(id1, createArticle({ id: id1 }));
    await articles.set(id3, createArticle({ id: id3 }));
    await articles.set(id2, createArticle({ id: id2 }));

    const ids = (await all(articles)).map((parts: [BlankNode, DatasetCore]): BlankNode => parts[0]);

    expect(ids).toStrictEqual([id1, id3, id2]);
  });
});
