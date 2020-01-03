import { blankNode } from '@rdfjs/data-model';
import ArticleNotFound from '../../src/errors/article-not-found';

describe('article not found error', (): void => {
  it('should be an error', async (): Promise<void> => {
    const error = new ArticleNotFound(blankNode());

    expect(error).toBeInstanceOf(Error);
  });

  it('should have a message', async (): Promise<void> => {
    const error = new ArticleNotFound(blankNode('12345'));

    expect(error.message).toBe('Article _:12345 could not be found');
  });

  it('should have an ID', async (): Promise<void> => {
    const id = blankNode();
    const error = new ArticleNotFound(id);

    expect(error.id).toBe(id);
  });
});
