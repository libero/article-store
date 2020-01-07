import { literal, namedNode, quad } from '@rdfjs/data-model';
import { parse as parseContentType } from 'content-type';
import 'jest-rdf';
import { addAll } from 'rdf-dataset-ext';
import { Quad } from 'rdf-js';
import { AppContext } from '../../src/app';
import jsonld from '../../src/middleware/jsonld';
import namespaces, { rdf, schema } from '../../src/namespaces';
import createContext, { Headers } from '../context';
import { Next } from '../middleware';

const makeRequest = async (
  body?: string, headers?: Headers, next: Next = jest.fn(), jsonLdContext = {},
): Promise<AppContext> => {
  const context = createContext({ body, headers, method: body ? 'POST' : 'GET' });

  await jsonld(jsonLdContext)(context, (): Promise<void> => next(context));

  return context;
};

const next = (body = null, quads: Array<Quad> = [], type = null, status = null) => (
  async ({ response }: AppContext): Promise<void> => {
    if (body) {
      response.body = body;
    }
    if (quads) {
      addAll(response.dataset, quads);
    }
    if (type) {
      response.type = type;
    }
    if (status) {
      response.status = status;
    }
  }
);

const id = namedNode('http://example.com/object');
const quads = [
  quad(id, rdf.type, schema.Article),
  quad(id, schema('name'), literal('English Name', 'en')),
  quad(id, schema('name'), literal('French Name', 'fr')),
];

const jsonLd = {
  '@id': 'http://example.com/object',
  '@type': 'http://schema.org/Article',
  'http://schema.org/name': [{ '@language': 'en', '@value': 'English Name' }, {
    '@language': 'fr',
    '@value': 'French Name',
  }],
};

describe('JSON-LD middleware', (): void => {
  it('adds a dataset to the request with JSON-LD body', async (): Promise<void> => {
    const { request } = await makeRequest(JSON.stringify(jsonLd), { 'Content-Type': 'application/ld+json' });

    expect([...request.dataset]).toEqualRdfQuadArray(quads);
  });

  it('does nothing if there is a request body that isn\'t JSON-LD', async (): Promise<void> => {
    const { request } = await makeRequest(JSON.stringify(jsonLd), { 'Content-Type': 'application/json' });

    expect(request.dataset.size).toBe(0);
  });

  it('sets the response JSON-LD body with the dataset', async (): Promise<void> => {
    const { response } = await makeRequest(null, null, next(null, quads));

    const contentType = parseContentType(response);

    expect(response.type).toBe('application/ld+json');
    expect(contentType.type).toBe('application/ld+json');
    expect(contentType.parameters).toMatchObject({ profile: 'http://www.w3.org/ns/json-ld#compacted' });
    expect(response.body).toStrictEqual(jsonLd);
    expect(response.status).toBe(200);
  });

  it('does not override the response status code', async (): Promise<void> => {
    const { response } = await makeRequest(null, null, next(null, quads, null, 201));

    expect(response.status).toBe(201);
  });

  it('sets the response JSON-LD body with the dataset using a context', async (): Promise<void> => {
    const context = {
      '@base': 'http://example.com',
      '@language': 'en',
      ...namespaces,
    };

    const { response } = await makeRequest(null, null, next(null, quads), context);

    const expected = {
      '@context': context,
      '@id': 'object',
      '@type': 'schema:Article',
      'schema:name': ['English Name', { '@value': 'French Name', '@language': 'fr' }],
    };

    expect(response.body).toStrictEqual(expected);
  });

  it('does nothing to the response if the dataset is empty', async (): Promise<void> => {
    const { response } = await makeRequest();

    expect(response.headers).not.toHaveProperty('content-type');
    expect(response.body).toBe(undefined);
    expect(response.status).toBe(undefined);
  });

  it('does nothing to the response if the body is already set', async (): Promise<void> => {
    const { response } = await makeRequest(null, null, next('some text', quads));

    expect(response.type).toBe('text/plain');
    expect(response.body).toBe('some text');
  });

  it('does nothing to the response if the status code is 204 No Content', async (): Promise<void> => {
    const { response } = await makeRequest(null, null, next(null, quads, null, 204));

    expect(response.headers).not.toHaveProperty('content-type');
    expect(response.body).toBe(undefined);
    expect(response.status).toBe(204);
  });
});
