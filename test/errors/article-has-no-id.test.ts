import ArticleHasNoId from '../../src/errors/article-has-no-id';

describe('article has no ID error', (): void => {
  it('should be an error', async (): Promise<void> => {
    const error = new ArticleHasNoId();

    expect(error).toBeInstanceOf(Error);
  });

  it('should have a message', async (): Promise<void> => {
    const error = new ArticleHasNoId();

    expect(error.message).toBe('Article must have an ID');
  });
});
