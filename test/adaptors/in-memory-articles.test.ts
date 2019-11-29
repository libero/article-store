import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import ArticleNotFound from '../../src/errors/article-not-found';

const article = (id: Iri, message?: string): JsonLdObj => ({
  '@id': id,
  '@type': 'http://schema.org/Article',
  'http://schema.org/name': { '@value': message ? message : `Article ${id}`, '@language': 'en' },
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

  it('can replace an exisitng article', async (): Promise<void> => {
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
});
