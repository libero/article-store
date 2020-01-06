import { blankNode } from '@rdfjs/data-model';
import all from 'it-all';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import { BlankNode } from 'rdf-js';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import ArticleNotFound from '../../src/errors/article-not-found';
import NotAnArticle from '../../src/errors/not-an-article';
import { schema } from '../../src/namespaces';
import createArticle from '../create-article';

describe('in-memory articles', (): void => {
  it('can add an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = blankNode();

    expect(await articles.contains(id)).toBe(false);

    await articles.set(id, createArticle(id));

    expect(await articles.contains(id)).toBe(true);
  });

  it('can add an article with multiple types', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = blankNode();

    await articles.set(id, {
      ...createArticle(id),
      '@type': ['http://schema.org/Article', 'http://schema.org/NewsArticle'],
    });

    expect(await articles.contains(id)).toBe(true);
  });

  it('can update an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = blankNode();

    await articles.set(id, createArticle(id, 'Original'));
    await articles.set(id, createArticle(id, 'Updated'));

    expect((await articles.get(id))['http://schema.org/name']).toBe('Updated');
  });

  it('throws an error if it is not an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = blankNode();

    await expect(articles.set(id, {
      ...createArticle(id),
      '@type': 'http://schema.org/NewsArticle',
    })).rejects.toThrow(new NotAnArticle([schema.NewsArticle]));
  });

  it('throws an error if it has no type', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = blankNode();

    await expect(articles.set(id, {
      ...createArticle(id),
      '@type': undefined,
    })).rejects.toThrow(new NotAnArticle());
  });

  it('can retrieve an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = blankNode();
    const article = createArticle(id);

    await articles.set(id, article);

    expect((await articles.get(id))).toStrictEqual(article);
  });

  it('throws an error if the article is not found', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = blankNode();

    await expect(articles.get(id)).rejects.toBeInstanceOf(ArticleNotFound);
    await expect(articles.get(id)).rejects.toHaveProperty('id', id);
  });

  it('can remove an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = blankNode();

    await articles.set(id, createArticle(id));
    await articles.remove(id);

    expect(await articles.contains(id)).toBe(false);
  });

  it('does nothing when trying to remove an article that is not there', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = blankNode();

    await expect(articles.remove(id)).resolves.not.toThrow();
  });

  it('can count the number of articles', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    expect(await articles.count()).toBe(0);

    const id1 = blankNode();
    const id2 = blankNode();

    await articles.set(id1, createArticle(id1));
    await articles.set(id2, createArticle(id2));
    await articles.set(id2, createArticle(id2));

    expect(await articles.count()).toBe(2);
  });

  it('can iterate through the articles', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    const id1 = blankNode();
    const id2 = blankNode();
    const id3 = blankNode();

    await articles.set(id1, createArticle(id1));
    await articles.set(id3, createArticle(id3));
    await articles.set(id2, createArticle(id2));

    const ids = (await all(articles)).map((parts: [BlankNode, JsonLdObj]): BlankNode => parts[0]);

    expect(ids).toStrictEqual([id1, id3, id2]);
  });
});
