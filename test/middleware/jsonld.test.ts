import { literal, namedNode, quad } from '@rdfjs/data-model';
import namespace from '@rdfjs/namespace';
import { parse as parseContentType } from 'content-type';
import 'jest-rdf';
import { Context as JsonLdContext } from 'jsonld/jsonld-spec';
import { addAll } from 'rdf-dataset-ext';
import { Quad } from 'rdf-js';
import { AppContext } from '../../src/app';
import jsonld from '../../src/middleware/jsonld';
import { rdf, schema } from '../../src/namespaces';
import createContext, { Headers } from '../context';
import { NextMiddleware } from '../middleware';

const makeRequest = async (
  body?: string, headers?: Headers, next: NextMiddleware = jest.fn(), jsonLdContext: JsonLdContext = {},
): Promise<AppContext> => {
  const context = createContext({ body, headers, method: body ? 'POST' : 'GET' });

  await jsonld(jsonLdContext)(context, (): Promise<void> => next(context));

  return context;
};

const next = (body?: unknown, quads?: Array<Quad>, type?: string, status?: number) => (
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

const dc = namespace('http://purl.org/dc/elements/1.1/');

const id = namedNode('http://example.com/object');
const quads = [
  quad(id, rdf.type, schema.Article),
  quad(id, schema('name'), literal('English Name', 'en')),
  quad(id, dc.title, literal('English Title', 'en')),
  quad(id, dc.title, literal('French Title', 'fr')),
];

const jsonLd = {
  '@id': 'http://example.com/object',
  '@type': ['http://schema.org/Article'],
  'http://schema.org/name': [{ '@value': 'English Name', '@language': 'en' }],
  'http://purl.org/dc/elements/1.1/title': [
    { '@value': 'English Title', '@language': 'en' },
    { '@value': 'French Title', '@language': 'fr' },
  ],
};

/**
 * @group unit
 */
describe('JSON-LD middleware', (): void => {
  it('adds a dataset to the request with JSON-LD body', async (): Promise<void> => {
    const { request } = await makeRequest(JSON.stringify(jsonLd), { 'Content-Type': 'application/ld+json' });

    expect([...request.dataset]).toBeRdfIsomorphic(quads);
  });

  it('does nothing if there is a request body that isn\'t JSON-LD', async (): Promise<void> => {
    const { request } = await makeRequest(JSON.stringify(jsonLd), { 'Content-Type': 'application/json' });

    expect(request.dataset.size).toBe(0);
  });

  it('sets the response JSON-LD body with the dataset', async (): Promise<void> => {
    const { response } = await makeRequest(undefined, undefined, next(undefined, quads));

    const contentType = parseContentType(response);
    const expected = {
      '@id': 'http://example.com/object',
      '@type': 'http://schema.org/Article',
      'http://purl.org/dc/elements/1.1/title': [
        { '@value': 'English Title' },
        { '@value': 'French Title', '@language': 'fr' },
      ],
      'http://schema.org/name': { '@value': 'English Name', '@language': 'en' },
    };

    expect(response.type).toBe('application/ld+json');
    expect(contentType.type).toBe('application/ld+json');
    expect(contentType.parameters).toMatchObject({ profile: 'http://www.w3.org/ns/json-ld#compacted' });
    expect(response.body).toMatchObject(expected);
    expect(response.status).toBe(200);
  });

  it('sets the response status code as 200 OK if there is a dataset', async (): Promise<void> => {
    const { response } = await makeRequest(undefined, undefined, next(undefined, quads));

    expect(response.status).toBe(200);
  });

  it('does not override the response status code', async (): Promise<void> => {
    const { response } = await makeRequest(undefined, undefined, next(undefined, quads, undefined, 201));

    expect(response.status).toBe(201);
  });

  it('sets the response JSON-LD body with the dataset using a context', async (): Promise<void> => {
    const context = {
      '@base': 'http://example.com',
      '@language': 'en',
      '@vocab': 'http://schema.org/',
      dc: 'http://purl.org/dc/elements/1.1/',
    };

    const { response } = await makeRequest(undefined, undefined, next(undefined, quads), context);

    const expected = {
      '@context': context,
      '@id': 'object',
      '@type': 'Article',
      name: 'English Name',
      'dc:title': ['English Title', { '@value': 'French Title', '@language': 'fr' }],
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
    const { response } = await makeRequest(undefined, undefined, next('some text', quads));

    expect(response.type).toBe('text/plain');
    expect(response.body).toBe('some text');
  });

  it('does nothing to the response if the status code is 204 No Content', async (): Promise<void> => {
    const { response } = await makeRequest(undefined, undefined, next(undefined, quads, undefined, 204));

    expect(response.headers).not.toHaveProperty('content-type');
    expect(response.body).toBe(undefined);
    expect(response.status).toBe(204);
  });
});
