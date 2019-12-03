import { Next, Response } from 'koa';
import { JsonLdObj } from 'jsonld/jsonld-spec';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import Articles from '../../src/articles';
import postArticle from '../../src/routes/post-article';
import createContext from '../context';
import runMiddleware from '../middleware';
import createArticle from '../create-article';


const makeRequest = async (
  body: JsonLdObj = {},
  next?: Next,
  articles: Articles = new InMemoryArticles((id: string) => id),
): Promise<Response> => {
  const context = createContext();
  context.request.body = body;

  return runMiddleware(postArticle(articles), context, next);
};

describe('post article', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const response = await makeRequest(createArticle());

    expect(response.status).toBe(204);
    expect(response.type).toBe('application/ld+json');
  });
});
