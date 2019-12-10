import createHttpError from 'http-errors';
import 'jest-extended';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import { Next, Response } from 'koa';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import Articles from '../../src/articles';
import addArticle from '../../src/routes/add-article';
import createContext from '../context';
import createArticle from '../create-article';
import runMiddleware from '../middleware';

const makeRequest = async (
  body: JsonLdObj = {},
  next?: Next,
  articles: Articles = new InMemoryArticles(),
): Promise<Response> => (
  runMiddleware(addArticle(), createContext({ articles, body }), next)
);

describe('add article', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const response = await makeRequest(createArticle(), undefined, articles);

    expect(response.status).toBe(204);
    expect(await articles.count()).toBe(1);
    expect([...articles][0]['http://schema.org/name']).toEqual('Article');
  });

  it('should throw an error if id is already set', async (): Promise<void> => {
    await expect(makeRequest(createArticle('_:1'))).rejects.toThrowWithMessage(createHttpError.Forbidden, 'Article IDs must not be set (\'_:1\' was given)');
  });
});
