import { namedNode } from '@rdfjs/data-model';
import ArticleNotFound from '../../src/errors/article-not-found';

describe('article not found error', (): void => {
  it('should be an error', async (): Promise<void> => {
    const error = new ArticleNotFound(namedNode('1'));

    expect(error).toBeInstanceOf(Error);
  });

  it('should have a message', async (): Promise<void> => {
    const error = new ArticleNotFound(namedNode('12345'));

    expect(error.message).toBe('Article 12345 could not be found');
  });

  it('should have an ID', async (): Promise<void> => {
    const id = namedNode('1');
    const error = new ArticleNotFound(id);

    expect(error.id).toBe(id);
  });
});
