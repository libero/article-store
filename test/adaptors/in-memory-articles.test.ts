import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import ArticleNotFound from '../../src/errors/article-not-found';

const article = (id: Iri): JsonLdObj => ({
  '@id': id,
  '@type': 'http://schema.org/Article',
  'http://schema.org/name': { '@value': `Article ${id}`, '@language': 'en' },
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

  it('can remove articles', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    await articles.add(article('_:1'));
    await articles.remove('_:1');

    expect(await articles.contains('_:1')).toBe(false);
  });

  it('throws an error if the article is not found', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    await expect(articles.get('_:67890')).rejects.toThrow(new ArticleNotFound('_:67890'));
  });
});
