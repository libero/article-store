import { DataFactory } from 'n3';
import ArticleNotFound from '../../src/errors/article-not-found';

describe('article not found error', (): void => {
  it('should be an error', async (): Promise<void> => {
    const error = new ArticleNotFound(DataFactory.namedNode('http://example.com/article12345'));

    expect(error).toBeInstanceOf(Error);
  });

  it('should have a message', async (): Promise<void> => {
    const error = new ArticleNotFound(DataFactory.namedNode('http://example.com/article12345'));

    expect(error.message).toBe('Article http://example.com/article12345 could not be found');
  });

  it('should have an ID', async (): Promise<void> => {
    const id = DataFactory.namedNode('http://example.com/article12345');
    const error = new ArticleNotFound(id);

    expect(error.id.equals(id)).toBe(true);
  });
});
