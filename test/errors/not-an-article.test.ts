import { literal, namedNode } from '@rdfjs/data-model';
import NotAnArticle from '../../src/errors/not-an-article';

describe('not an article error', (): void => {
  it('should be an error', async (): Promise<void> => {
    const error = new NotAnArticle();

    expect(error).toBeInstanceOf(Error);
  });

  it('should have a message', async (): Promise<void> => {
    const error = new NotAnArticle();

    expect(error.message).toBe('Article type must be http://schema.org/Article (none was given)');
    expect(error.types).toHaveLength(0);
  });

  it('may have types', async (): Promise<void> => {
    const error = new NotAnArticle([namedNode('http://schema.org/NewsArticle'), literal('book')]);

    expect(error.message).toBe('Article type must be http://schema.org/Article (\'http://schema.org/NewsArticle, "book"\' was given)');
    expect(error.types).toStrictEqual([namedNode('http://schema.org/NewsArticle'), literal('book')]);
  });
});
