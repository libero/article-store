import {
  blankNode, literal, namedNode, quad,
} from '@rdfjs/data-model';
import createHttpError from 'http-errors';
import all from 'it-all';
import { Next, Response } from 'koa';
import { deleteMatch } from 'rdf-dataset-ext';
import { DatasetCore } from 'rdf-js';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import Articles from '../../src/articles';
import { rdf, schema } from '../../src/namespaces';
import addArticle from '../../src/routes/add-article';
import createContext from '../context';
import createArticle from '../create-article';
import runMiddleware from '../middleware';

const makeRequest = async (
  dataset?: DatasetCore,
  next?: Next,
  articles: Articles = new InMemoryArticles(),
): Promise<Response> => (
  runMiddleware(addArticle(), createContext({ articles, dataset }), next)
);

describe('add article', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const id = blankNode();
    const name = literal('Article');
    const response = await makeRequest(createArticle(id, name), undefined, articles);

    expect(response.status).toBe(201);
    expect(response.get('Location')).toBe('http://example.com/path-to/article-list');
    expect(await articles.count()).toBe(1);

    const [newId, dataset] = (await all(articles))[0];

    expect(dataset.has(quad(newId, schema.name, name))).toBe(true);
  });

  it('should throw an error if it is not a schema:Article', async (): Promise<void> => {
    const id = blankNode();
    const article = createArticle(id)
      .delete(quad(id, rdf.type, schema.Article))
      .add(quad(id, rdf.type, schema.NewsArticle));

    await expect(makeRequest(article)).rejects.toBeInstanceOf(createHttpError.BadRequest);
    await expect(makeRequest(article)).rejects.toHaveProperty('message', 'No http://schema.org/Article found');
  });

  it('should throw an error if the articles does not have a blank node identifier', async (): Promise<void> => {
    const id = namedNode('http://example.com/my-article');
    const article = createArticle(id);

    await expect(makeRequest(article)).rejects.toBeInstanceOf(createHttpError.BadRequest);
    await expect(makeRequest(article)).rejects.toHaveProperty('message', 'Article must have a blank node identifier (http://example.com/my-article given)');
  });

  it('should throw an error if it has no schema:name', async (): Promise<void> => {
    const id = blankNode();

    const article = deleteMatch(createArticle(id), id, schema('name'));

    await expect(makeRequest(article)).rejects.toBeInstanceOf(createHttpError.BadRequest);
    await expect(makeRequest(article)).rejects.toHaveProperty('message', 'Article must have at least one http://schema.org/name');
  });
});
