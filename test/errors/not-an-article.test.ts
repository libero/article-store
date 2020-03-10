import { literal } from '@rdfjs/data-model';
import { schema } from '@tpluscode/rdf-ns-builders';
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
    const error = new NotAnArticle([schema.NewsArticle, literal('book')]);

    expect(error.message).toBe('Article type must be http://schema.org/Article (\'http://schema.org/NewsArticle, "book"\' was given)');
    expect(error.types).toStrictEqual([schema.NewsArticle, literal('book')]);
  });
});
