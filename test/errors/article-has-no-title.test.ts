import ArticleHasNoTitle from '../../src/errors/article-has-no-title';

describe('article has no title error', (): void => {
  it('should be an error', async (): Promise<void> => {
    const error = new ArticleHasNoTitle();

    expect(error).toBeInstanceOf(Error);
  });

  it('should have a message', async (): Promise<void> => {
    const error = new ArticleHasNoTitle();

    expect(error.message).toBe('Article must have at least one http://schema.org/name');
  });
});
