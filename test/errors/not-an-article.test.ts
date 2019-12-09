import NotAnArticle from '../../src/errors/not-an-article';

describe('not an article error', (): void => {
  it('should be an error', async (): Promise<void> => {
    const error = new NotAnArticle();

    expect(error).toBeInstanceOf(Error);
  });

  it('should have a message', async (): Promise<void> => {
    const error = new NotAnArticle();

    expect(error.message).toBe('Article type must be http://schema.org/Article (none was given)');
  });

  it('may have a type', async (): Promise<void> => {
    const error = new NotAnArticle('http://schema.org/NewsArticle');

    expect(error.message).toBe('Article type must be http://schema.org/Article (\'http://schema.org/NewsArticle\' was given)');
  });
});
