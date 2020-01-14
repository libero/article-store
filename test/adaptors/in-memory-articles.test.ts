import { literal, namedNode, quad } from '@rdfjs/data-model';
import all from 'it-all';
import 'jest-rdf';
import { DatasetCore, NamedNode } from 'rdf-js';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import ArticleNotFound from '../../src/errors/article-not-found';
import NotAnArticle from '../../src/errors/not-an-article';
import { schema } from '../../src/namespaces';
import createArticle from '../create-article';

describe('in-memory articles', (): void => {
  it('can add an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = namedNode('one');

    expect(await articles.contains(id)).toBe(false);

    await articles.set(id, createArticle({ id }));

    expect(await articles.contains(id)).toBe(true);
  });

  it('can add an article with multiple types', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = namedNode('one');
    const article = createArticle({ id, types: [schema.Article, schema.NewsArticle] });

    await articles.set(id, article);

    expect(await articles.contains(id)).toBe(true);
  });

  it('can update an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = namedNode('one');

    await articles.set(id, createArticle({ id, name: literal('Original') }));
    await articles.set(id, createArticle({ id, name: literal('Updated') }));

    expect((await articles.get(id)).has(quad(id, schema('name'), literal('Updated')))).toBe(true);
  });

  it('throws an error if it is not an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = namedNode('one');
    const article = createArticle({ id, types: [schema.NewsArticle] });

    await expect(articles.set(id, article)).rejects.toThrow(new NotAnArticle([schema.NewsArticle]));
  });

  it('throws an error if it has no type', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = namedNode('one');
    const article = createArticle({ id, types: [] });

    await expect(articles.set(id, article)).rejects.toThrow(new NotAnArticle());
  });

  it('can retrieve an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = namedNode('one');
    const article = createArticle({ id });

    await articles.set(id, article);

    expect([...await articles.get(id)]).toEqualRdfQuadArray([...article]);
  });

  it('throws an error if the article is not found', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = namedNode('one');

    await expect(articles.get(id)).rejects.toBeInstanceOf(ArticleNotFound);
    await expect(articles.get(id)).rejects.toHaveProperty('id', id);
  });

  it('can remove an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = namedNode('one');

    await articles.set(id, createArticle({ id }));
    await articles.remove(id);

    expect(await articles.contains(id)).toBe(false);
  });

  it('does nothing when trying to remove an article that is not there', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = namedNode('one');

    await expect(articles.remove(id)).resolves.not.toThrow();
  });

  it('can count the number of articles', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    expect(await articles.count()).toBe(0);

    const id1 = namedNode('one');
    const id2 = namedNode('two');

    await articles.set(id1, createArticle({ id: id1 }));
    await articles.set(id2, createArticle({ id: id2 }));
    await articles.set(id2, createArticle({ id: id2 }));

    expect(await articles.count()).toBe(2);
  });

  it('can iterate through the articles', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    const id1 = namedNode('one');
    const id2 = namedNode('two');
    const id3 = namedNode('three');

    await articles.set(id1, createArticle({ id: id1 }));
    await articles.set(id3, createArticle({ id: id3 }));
    await articles.set(id2, createArticle({ id: id2 }));

    const ids = (await all(articles)).map((parts: [NamedNode, DatasetCore]): NamedNode => parts[0]);

    expect(ids).toStrictEqual([id1, id3, id2]);
  });
});
