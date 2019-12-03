import { Next, Response } from 'koa';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import Articles from '../../src/articles';
import postArticle from '../../src/routes/post-article';
import createContext from '../context';
import runMiddleware from '../middleware';
import createArticle from '../create-article';
import createHttpError = require('http-errors');

const makeRequest = async (
  body: JsonLdObj = {},
  next?: Next,
  articles: Articles = new InMemoryArticles(),
): Promise<Response> => {
  const context = createContext();
  context.request.body = body;

  return runMiddleware(postArticle(articles), context, next);
};

describe('post article', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const response = await makeRequest(createArticle('_:1'));

    expect(response.status).toBe(204);
    expect(response.type).toBe('application/ld+json');
  });

  it('throws an error if the article is not able to be added', async (): Promise<void> => {
    await expect(makeRequest()).rejects.toThrow(new createHttpError.NotImplemented());
  });
});
