import { Iri, JsonLdObj } from 'jsonld/jsonld-spec';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import ArticleNotFound from '../../src/errors/article-not-found';
import InvalidId from '../../src/errors/invalid-id';

const createArticle = (id: Iri, name = `Article ${id}`): JsonLdObj => ({
  '@id': id,
  '@type': 'http://schema.org/Article',
  'http://schema.org/name': name,
});

describe('in-memory articles', (): void => {
  it('can add an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    expect(await articles.contains('_:1')).toBe(false);

    await articles.add(createArticle('_:1'));

    expect(await articles.contains('_:1')).toBe(true);
  });

  it('can update an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    await articles.add(createArticle('_:1', 'Original'));
    await articles.add(createArticle('_:1', 'Updated'));

    expect((await articles.get('_:1'))['http://schema.org/name']).toBe('Updated');
  });

  it('throws an error if the article does not have an ID', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    await expect(articles.add({})).rejects.toThrow(new InvalidId());
  });

  it('can retrieve an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    await articles.add(createArticle('_:1'));

    expect((await articles.get('_:1'))['@id']).toBe('_:1');
  });

  it('throws an error if the article is not found', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    await expect(articles.get('_:1')).rejects.toThrow(new ArticleNotFound('_:1'));
  });

  it('can remove an article', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    await articles.add(createArticle('_:1'));
    await articles.remove('_:1');

    expect(await articles.contains('_:1')).toBe(false);
  });

  it('does nothing when trying to remove an article that is not there', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    await expect(articles.remove('_:1')).resolves.not.toThrow();
  });

  it('can count the number of articles', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    expect(await articles.count()).toBe(0);

    await articles.add(createArticle('_:1'));
    await articles.add(createArticle('_:2'));
    await articles.add(createArticle('_:2'));

    expect(await articles.count()).toBe(2);
  });

  it('can iterate through the articles', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    await articles.add(createArticle('_:1'));
    await articles.add(createArticle('_:3'));
    await articles.add(createArticle('_:2'));

    const ids = [...articles].map((article: JsonLdObj): Iri => article['@id']);

    expect(ids).toStrictEqual(['_:1', '_:3', '_:2']);
  });
});
