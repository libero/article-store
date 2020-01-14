import { namedNode, quad } from '@rdfjs/data-model';
import { Response } from 'koa';
import { toRdf } from 'rdf-literal';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import Articles from '../../src/articles';
import { WithDataset } from '../../src/middleware/dataset';
import { hydra, rdf } from '../../src/namespaces';
import articleList from '../../src/routes/article-list';
import createContext from '../context';
import createArticle from '../create-article';
import runMiddleware, { NextMiddleware } from '../middleware';

const makeRequest = async (next?: NextMiddleware, articles?: Articles): Promise<WithDataset<Response>> => (
  runMiddleware(articleList(), createContext({ articles }), next)
);

describe('article list', (): void => {
  it('should return a successful response', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.status).toBe(200);
  });

  it('should return an empty list', async (): Promise<void> => {
    const { dataset } = await makeRequest();
    const id = namedNode('http://example.com/path-to/article-list');

    expect(dataset.has(quad(id, rdf.type, hydra.Collection))).toBe(true);
    expect(dataset.match(id, hydra.title).size).toBe(1);
    expect(dataset.match(id, hydra.manages).size).toBe(1);
    expect(dataset.match(id, hydra.totalItems, toRdf(0)).size).toBe(1);
    expect(dataset.match(id, hydra.member).size).toBe(0);
  });

  it('should return articles in the list', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    const id1 = namedNode('one');
    const id2 = namedNode('two');

    await articles.set(id1, createArticle({ id: id1 }));
    await articles.set(id2, createArticle({ id: id2 }));

    const { dataset } = await makeRequest(undefined, articles);
    const id = namedNode('http://example.com/path-to/article-list');

    expect(dataset.match(id, hydra.member).size).toBe(2);
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
