import {
  blankNode, literal, namedNode, quad,
} from '@rdfjs/data-model';
import createHttpError from 'http-errors';
import all from 'it-all';
import { Response } from 'koa';
import { DatasetCore } from 'rdf-js';
import Router from '@koa/router';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import Articles from '../../src/articles';
import { schema } from '../../src/namespaces';
import addArticle from '../../src/routes/add-article';
import createContext from '../context';
import createArticle from '../create-article';
import runMiddleware, { NextMiddleware } from '../middleware';

const makeRequest = async (
  dataset?: DatasetCore,
  next?: NextMiddleware,
  articles: Articles = new InMemoryArticles(),
  router?: Router,
): Promise<Response> => (
  runMiddleware(addArticle(), createContext({ articles, dataset, router }), next)
);

describe('add article', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = blankNode();
    const name = literal('Article');
    const dummyRouter = {
      url(): string {
        return '/path-to/article/one';
      },
    } as unknown as Router;
    const response = await makeRequest(createArticle({ id, name }), undefined, articles, dummyRouter);

    expect(response.status).toBe(201);
    expect(response.get('Location')).toBe('http://example.com/path-to/article/one');
    expect(await articles.count()).toBe(1);

    const [newId, dataset] = (await all(articles))[0];

    expect(dataset.has(quad(newId, schema('name'), name))).toBe(true);
  });

  it('should throw an error if it is not a schema:Article', async (): Promise<void> => {
    const article = createArticle({ types: [schema.NewsArticle] });

    await expect(makeRequest(article)).rejects.toBeInstanceOf(createHttpError.BadRequest);
    await expect(makeRequest(article)).rejects.toHaveProperty('message', 'No http://schema.org/Article found');
  });

  it('should throw an error if the articles does not have a blank node identifier', async (): Promise<void> => {
    const id = namedNode('http://example.com/my-article');
    const article = createArticle({ id });

    await expect(makeRequest(article)).rejects.toBeInstanceOf(createHttpError.BadRequest);
    await expect(makeRequest(article)).rejects.toHaveProperty('message', 'Article must have a blank node identifier (http://example.com/my-article given)');
  });

  it('should throw an error if it has no schema:name', async (): Promise<void> => {
    const article = createArticle({ name: null });

    await expect(makeRequest(article)).rejects.toBeInstanceOf(createHttpError.BadRequest);
    await expect(makeRequest(article)).rejects.toHaveProperty('message', 'Article must have at least one http://schema.org/name');
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(createArticle(), next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
