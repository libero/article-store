import { literal, namedNode, quad } from '@rdfjs/data-model';
import { OK } from 'http-status-codes';
import 'jest-rdf';
import { Response } from 'koa';
import { toRdf } from 'rdf-literal';
import InMemoryArticles from '../../src/adaptors/in-memory-articles';
import Articles from '../../src/articles';
import { WithDataset } from '../../src/middleware/dataset';
import { hydra, rdf, schema } from '../../src/namespaces';
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

    expect(response.status).toBe(OK);
  });

  it('should return a collection', async (): Promise<void> => {
    const { dataset } = await makeRequest();
    const id = namedNode('http://example.com/path-to/article-list');

    expect(dataset).toBeRdfDatasetContaining(
      quad(id, rdf.type, hydra.Collection),
      quad(id, hydra.title, literal('List of articles', 'en')),
    );
  });

  it('should contain articles', async (): Promise<void> => {
    const { dataset } = await makeRequest();
    const id = namedNode('http://example.com/path-to/article-list');

    expect(dataset).toBeRdfDatasetMatching({ subject: id, predicate: hydra.manages });

    const [{ object: manages }] = dataset.match(id, hydra.manages);

    expect(dataset).toBeRdfDatasetContaining(
      quad(manages, hydra.property, rdf.type),
      quad(manages, hydra.object, schema.Article),
    );
  });

  it('should return an empty list', async (): Promise<void> => {
    const { dataset } = await makeRequest();
    const id = namedNode('http://example.com/path-to/article-list');

    expect(dataset).toBeRdfDatasetContaining(quad(id, hydra.totalItems, toRdf(0)));
    expect(dataset).toBeRdfDatasetMatching({ subject: id, predicate: hydra.member }, 0);
  });

  it('should return articles in the list', async (): Promise<void> => {
    const articles = new InMemoryArticles();

    const id1 = namedNode('one');
    const id2 = namedNode('two');

    await articles.set(id1, createArticle({ id: id1 }));
    await articles.set(id2, createArticle({ id: id2 }));

    const { dataset } = await makeRequest(undefined, articles);
    const id = namedNode('http://example.com/path-to/article-list');

    expect(dataset).toBeRdfDatasetMatching({ subject: id, predicate: hydra.member }, 2);
    expect(dataset).toBeRdfDatasetContaining(
      quad(id, hydra.member, id1),
      quad(id, hydra.member, id2),
    );
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
