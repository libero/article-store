import {
  namedNode,
} from '@rdfjs/data-model';
import createHttpError from 'http-errors';
import { Response } from 'koa';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import Articles from '../../src/articles';
import article from '../../src/routes/article';
import createContext from '../context';
import createArticle from '../create-article';
import runMiddleware, { NextMiddleware } from '../middleware';
import { WithDataset } from '../../src/middleware/dataset';

const makeRequest = async (
  next?: NextMiddleware,
  path?: string,
  articles?: Articles,
): Promise<WithDataset<Response>> => (
  runMiddleware(article(), createContext({ path, articles }), next)
);

describe('article', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    const id = namedNode('http://example.com/path-to/article/one');
    await articles.set(id, createArticle({ id }));

    const response = await makeRequest(undefined, 'path-to/article/one', articles);

    expect(response.status).toBe(200);
  });

  it('should throw an error if article is not found', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const response = makeRequest(undefined, 'http://example.com/path-to/article/not-found', articles);

    await expect(response).rejects.toBeInstanceOf(createHttpError.NotFound);
    await expect(response).rejects.toHaveProperty('message', 'Article http://example.com/path-to/article/not-found could not be found');
  });

  it('should call the next middleware', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    const id = namedNode('http://example.com/path-to/article/one');
    await articles.set(id, createArticle({ id }));

    const next = jest.fn();
    await makeRequest(next, 'http://example.com/path-to/article/one', articles);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
