import ArticleIdAlreadySet from '../../src/errors/article-id-already-set';
import createHttpError = require('http-errors');

describe('article ID is already set', (): void => {
  it('should be a http conflict error', async (): Promise<void> => {
    const error = new ArticleIdAlreadySet('12345');

    expect(error).toBeInstanceOf(createHttpError.Conflict);
  });

  it('should have a message', async (): Promise<void> => {
    const error = new ArticleIdAlreadySet('12345');

    expect(error.message).toBe('Article ID is already set');
  });
});
