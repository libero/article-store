import { namedNode } from '@rdfjs/data-model';
import createHttpError from 'http-errors';
import { OK } from 'http-status-codes';
import 'jest-rdf';
import { Response } from 'koa';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import Articles from '../../src/articles';
import { WithDataset } from '../../src/middleware/dataset';
import article from '../../src/routes/article';
import { createAppContext } from '../context';
import createArticle from '../create-article';
import runMiddleware, { NextMiddleware } from '../middleware';

const makeRequest = async (
  path: string, articles?: Articles, next?: NextMiddleware,
): Promise<WithDataset<Response>> => (
  runMiddleware(article(), createAppContext({ articles, path }), next)
);

describe('article', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const id = namedNode('http://example.com/path-to/article/one');
    const articles = new InMemoryArticles();
    await articles.set(id, createArticle({ id }));

    const response = await makeRequest('path-to/article/one', articles);

    expect(response.status).toBe(OK);
  });

  it('should return the article', async (): Promise<void> => {
    const id = namedNode('http://example.com/path-to/article/one');
    const articles = new InMemoryArticles();
    const article1 = createArticle({ id });
    await articles.set(id, article1);

    const response = await makeRequest('path-to/article/one', articles);

    expect(response.dataset).toBeRdfIsomorphic(article1);
  });

  it('should throw an error if article is not found', async (): Promise<void> => {
    const response = makeRequest('path-to/article/not-found');

    await expect(response).rejects.toBeInstanceOf(createHttpError.NotFound);
    await expect(response).rejects.toHaveProperty('message', 'Article http://example.com/path-to/article/not-found could not be found');
  });

  it('should call the next middleware', async (): Promise<void> => {
    const id = namedNode('http://example.com/path-to/article/one');
    const articles = new InMemoryArticles();
    await articles.set(id, createArticle({ id }));
    const next = jest.fn();

    await makeRequest('path-to/article/one', articles, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
