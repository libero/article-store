import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import ArticleNotFound from '../../src/errors/article-not-found';
import InvalidId from '../../src/errors/invalid-id';

const article = (id: Iri, message?: string): JsonLdObj => ({
  '@id': id,
  '@type': 'http://schema.org/Article',
  'http://schema.org/name': { '@value': message || `Article ${id}`, '@language': 'en' },
});

describe('in-memory articles', (): void => {
  it('should count the number of articles', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    expect(await articles.count()).toBe(0);

    await articles.add(article('_:1'));
    await articles.add(article('_:2'));

    expect(await articles.count()).toBe(2);
  });

  it('can add articles', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    expect(await articles.contains('_:1')).toBe(false);

    await articles.add(article('_:1'));

    expect(await articles.contains('_:1')).toBe(true);
  });

  it('can replace an existing article', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    expect(await articles.contains('_:1')).toBe(false);

    await articles.add(article('_:1'));
    expect(await articles.count()).toBe(1);
    expect(await articles.contains('_:1')).toBe(true);
    expect((await articles.get('_:1'))['http://schema.org/name']['@value']).toEqual('Article _:1');

    await articles.add(article('_:1', 'Article _:1 v2'));
    expect(await articles.count()).toBe(1);
    expect(await articles.contains('_:1')).toBe(true);
    expect((await articles.get('_:1'))['http://schema.org/name']['@value']).toEqual('Article _:1 v2');
  });

  it('throws an error if no id set for article', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    await expect(articles.add({})).rejects.toThrow(new InvalidId());
  });

  it('can remove articles', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    await articles.add(article('_:1'));
    await articles.remove('_:1');

    expect(await articles.contains('_:1')).toBe(false);
  });

  it('can handle removal request of article not in list', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    expect(await articles.contains('_:1')).toBe(false);
    await articles.remove('_:1');
  });

  it('throws an error if the article is not found', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    await expect(articles.get('_:67890')).rejects.toThrow(new ArticleNotFound('_:67890'));
  });

  it('can retrieve an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    expect(await articles.contains('_:67890')).toBe(false);
    await articles.add(article('_:67890'));

    await expect(await articles.get('_:67890')).toEqual({
      '@id': '_:67890',
      '@type': 'http://schema.org/Article',
      'http://schema.org/name': { '@value': 'Article _:67890', '@language': 'en' },
    });
  });

  it('can retrieve the list of articles', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    await articles.add(article('_:1'));
    await articles.add(article('_:2'));
    const articlesIterator = articles[Symbol.iterator]();
    expect(articlesIterator.next()).toEqual({
      done: false,
      value: {
        '@id': '_:1',
        '@type': 'http://schema.org/Article',
        'http://schema.org/name': { '@value': 'Article _:1', '@language': 'en' },
      },
    });
    expect(articlesIterator.next()).toEqual({
      done: false,
      value: {
        '@id': '_:2',
        '@type': 'http://schema.org/Article',
        'http://schema.org/name': { '@value': 'Article _:2', '@language': 'en' },
      },
    });
    expect(articlesIterator.next()).toEqual({
      done: true,
      value: undefined,
    });
  });
});
