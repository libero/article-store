import ArticleHasIncorrectType from '../../src/errors/article-has-incorrect-type';

describe('article has incorrect type error', (): void => {
  it('should be an error', async (): Promise<void> => {
    const error = new ArticleHasIncorrectType();

    expect(error).toBeInstanceOf(Error);
  });

  it('should have a message', async (): Promise<void> => {
    const error = new ArticleHasIncorrectType();

    expect(error.message).toBe('Article type must be http://schema.org/Article (none was given)');
  });

  it('may have a type', async (): Promise<void> => {
    const error = new ArticleHasIncorrectType('http://schema.org/NewsArticle');

    expect(error.message).toBe('Article type must be http://schema.org/Article (\'http://schema.org/NewsArticle\' was given)');
  });
});
