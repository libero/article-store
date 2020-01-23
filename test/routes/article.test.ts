import {
  namedNode,
} from '@rdfjs/data-model';
import createHttpError from 'http-errors';
import { OK } from 'http-status-codes';
import { Response } from 'koa';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import Articles from '../../src/articles';
import article from '../../src/routes/article';
import createContext from '../context';
import createArticle from '../create-article';
import runMiddleware, { NextMiddleware, throwingNext } from '../middleware';
import { WithDataset } from '../../src/middleware/dataset';

const makeRequest = async (
  path: string,
  articles?: Articles,
  next: NextMiddleware = throwingNext(new createHttpError.NotFound()),
): Promise<WithDataset<Response>> => (
  runMiddleware(article(), createContext({ articles, path }), next)
);

describe('article', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const id = namedNode('http://example.com/path-to/article/one');
    const articles = new InMemoryArticles();
    await articles.set(id, createArticle({ id }));

    const response = await makeRequest('path-to/article/one', articles);

    expect(response.status).toBe(OK);
  });

  it('should not attempt article retrieval when next middleware throws not found http error', async (): Promise<void> => {
    const mockArticles: Articles = {
      set: jest.fn(),
      get: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn(),
      count: jest.fn(),
      [Symbol.asyncIterator]: jest.fn(),
    };

    const next = jest.fn();
    await makeRequest('path-to/article/one', mockArticles, next);
    expect(mockArticles.get).toHaveBeenCalledTimes(0);
  });

  it('should throw an error if article is not found', async (): Promise<void> => {
    const response = makeRequest('path-to/article/not-found');

    await expect(response).rejects.toBeInstanceOf(createHttpError.NotFound);
    await expect(response).rejects.toHaveProperty('message', 'Article http://example.com/path-to/article/not-found could not be found');
  });

  it('should throw error raised in next middleware', async (): Promise<void> => {
    const response = makeRequest('path-to/article/not-found', undefined, throwingNext(new createHttpError.BadRequest()));

    await expect(response).rejects.toBeInstanceOf(createHttpError.BadRequest);
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest('path-to/article/one', undefined, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
