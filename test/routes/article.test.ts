import {
  namedNode,
} from '@rdfjs/data-model';
import createHttpError from 'http-errors';
import { Response } from 'koa';
import { DatasetCore, NamedNode } from 'rdf-js';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import Articles from '../../src/articles';
import article from '../../src/routes/article';
import createContext from '../context';
import createArticle from '../create-article';
import runMiddleware, { NextMiddleware } from '../middleware';
import { WithDataset } from '../../src/middleware/dataset';
import ArticleNotFound from '../../src/errors/article-not-found';

const dummyNext = async (): Promise<void> => {
  throw new createHttpError.NotFound();
};

const makeRequest = async (
  articles: Articles,
  url: string,
  next?: NextMiddleware,
): Promise<WithDataset<Response>> => (
  runMiddleware(article(articles), createContext({ url }), typeof next !== 'undefined' ? next : dummyNext)
);

describe('article', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    const id = namedNode('http://example.com/path-to/article/one');
    await articles.set(id, createArticle({ id }));

    const response = await makeRequest(articles, 'path-to/article/one');

    expect(response.status).toBe(200);
  });

  it('should only attempt article retrieval if next middleware throws not found http error', async (): Promise<void> => {
    const mockArticles: Articles = {
      set: jest.fn(),
      get: jest.fn(async (id: NamedNode): Promise<DatasetCore> => {
        throw new ArticleNotFound(id);
      }),
      remove: jest.fn(),
      contains: jest.fn(),
      count: jest.fn(),
      [Symbol.asyncIterator]: jest.fn(),
    };

    const next = jest.fn();
    await makeRequest(mockArticles, 'path-to/article/one', next);
    expect(mockArticles.get).toHaveBeenCalledTimes(0);
    await expect(makeRequest(mockArticles, 'path-to/article/one')).rejects.toBeInstanceOf(createHttpError.NotFound);
    expect(mockArticles.get).toHaveBeenCalledTimes(1);
    expect(mockArticles.get).toHaveBeenCalledWith(namedNode('http://example.com/path-to/article/one'));
  });

  it('should throw an error if article is not found', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const response = makeRequest(articles, 'path-to/article/not-found');

    await expect(response).rejects.toBeInstanceOf(createHttpError.NotFound);
    await expect(response).rejects.toHaveProperty('message', 'Article http://example.com/path-to/article/not-found could not be found');
  });

  it('should call the next middleware', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    const id = namedNode('http://example.com/path-to/article/one');
    await articles.set(id, createArticle({ id }));

    const next = jest.fn();
    await makeRequest(articles, 'path-to/article/one', next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
