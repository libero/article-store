import all from 'it-all';
import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import ArticleNotFound from '../../src/errors/article-not-found';
import NotAnArticle from '../../src/errors/not-an-article';
import createArticle from '../create-article';

describe('in-memory articles', (): void => {
  it('can add an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = '_:1';

    expect(await articles.contains(id)).toBe(false);

    await articles.set(id, createArticle(id));

    expect(await articles.contains(id)).toBe(true);
  });

  it('can add an article with multiple types', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = '_:1';

    await articles.set(id, {
      ...createArticle(id),
      '@type': ['http://schema.org/Article', 'http://schema.org/NewsArticle'],
    });

    expect(await articles.contains(id)).toBe(true);
  });

  it('can update an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = '_:1';

    await articles.set(id, createArticle(id, 'Original'));
    await articles.set(id, createArticle(id, 'Updated'));

    expect((await articles.get(id))['http://schema.org/name']).toBe('Updated');
  });

  it('throws an error if it is not an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = '_:1';

    await expect(articles.set(id, {
      ...createArticle(id),
      '@type': 'http://schema.org/NewsArticle',
    })).rejects.toThrow(new NotAnArticle(['http://schema.org/NewsArticle']));
  });

  it('throws an error if it has no type', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = '_:1';

    await expect(articles.set(id, {
      ...createArticle(id),
      '@type': undefined,
    })).rejects.toThrow(new NotAnArticle());
  });

  it('can retrieve an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = '_:1';

    await articles.set(id, createArticle(id));

    expect((await articles.get(id))['@id']).toBe(id);
  });

  it('throws an error if the article is not found', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    await expect(articles.get('_:1')).rejects.toBeInstanceOf(ArticleNotFound);
    await expect(articles.get('_:1')).rejects.toHaveProperty('id', '_:1');
  });

  it('can remove an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = '_:1';

    await articles.set(id, createArticle(id));
    await articles.remove(id);

    expect(await articles.contains(id)).toBe(false);
  });

  it('does nothing when trying to remove an article that is not there', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = '_:1';

    await expect(articles.remove(id)).resolves.not.toThrow();
  });

  it('can count the number of articles', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    expect(await articles.count()).toBe(0);

    const id1 = '_:1';
    const id2 = '_:2';

    await articles.set(id1, createArticle(id1));
    await articles.set(id2, createArticle(id2));
    await articles.set(id2, createArticle(id2));

    expect(await articles.count()).toBe(2);
  });

  it('can iterate through the articles', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    const id1 = '_:1';
    const id2 = '_:2';
    const id3 = '_:3';

    await articles.set(id1, createArticle(id1));
    await articles.set(id3, createArticle(id3));
    await articles.set(id2, createArticle(id2));

    const ids = (await all(articles)).map((parts: [Iri, JsonLdObj]): Iri => parts[0]);

    expect(ids).toStrictEqual([id1, id3, id2]);
  });
});
