import { blankNode, namedNode, quad } from '@rdfjs/data-model';
import createHttpError from 'http-errors';
import { CREATED } from 'http-status-codes';
import all from 'it-all';
import 'jest-rdf';
import { Response } from 'koa';
import { DatasetCore } from 'rdf-js';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import Articles from '../../src/articles';
import { schema } from '../../src/namespaces';
import addArticle from '../../src/routes/add-article';
import { createAppContext } from '../context';
import createArticle from '../create-article';
import runMiddleware, { NextMiddleware } from '../middleware';

const makeRequest = async (
  dataset?: DatasetCore,
  next?: NextMiddleware,
  articles: Articles = new InMemoryArticles(),
): Promise<Response> => (
  runMiddleware(addArticle(), createAppContext({ articles, dataset }), next)
);

describe('add article', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const articles = new InMemoryArticles();
    const article = createArticle();
    const response = await makeRequest(article, undefined, articles);

    expect(response.status).toBe(CREATED);
    expect(await articles.count()).toBe(1);

    const [[newId]] = (await all(articles));

    expect(response.get('Location')).toBe(newId.value);
  });

  it('should updates the IDs', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    const id = blankNode();
    const partId = blankNode();
    const article = createArticle({ id })
      .add(quad(id, schema.hasPart, partId))
      .add(quad(partId, schema.isPartOf, id));

    const expectedId = namedNode('http://example.com/path-to/article');
    const expectedPartId = blankNode();
    const expectedArticle = createArticle({ id: expectedId })
      .add(quad(expectedId, schema.hasPart, expectedPartId))
      .add(quad(expectedPartId, schema.isPartOf, expectedId));

    await makeRequest(article, undefined, articles);

    const [[newId, newArticle]] = (await all(articles));

    expect(newId).toStrictEqual(expectedId);
    expect(newArticle).toBeRdfIsomorphic(expectedArticle);
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
