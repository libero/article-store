import { parse as parseContentType } from 'content-type';
import { Context as JsonLdContext } from 'jsonld/jsonld-spec';
import { Context, Response } from 'koa';
import jsonld from '../../src/middleware/jsonld';
import createContext from '../context';
import runMiddleware, { Next } from '../middleware';

const makeRequest = async (next?: Next, jsonLdContext: JsonLdContext = {}): Promise<Response> => (
  runMiddleware(jsonld(jsonLdContext), createContext(), next)
);

const next = (body: unknown, type: string) => async ({ response }: Context): Promise<void> => {
  response.body = body;
  response.type = type;
};

const content = {
  '@id': 'http://example.com/object',
  '@type': ['http://schema.org/Article'],
  'http://schema.org/name': [{ '@value': 'English Name', '@language': 'en' }],
  'http://purl.org/dc/elements/1.1/title': [
    { '@value': 'English Title', '@language': 'en' },
    { '@value': 'French Title', '@language': 'fr' },
  ],
};

describe('JSON-LD middleware', (): void => {
  it('should compact JSON-LD', async (): Promise<void> => {
    const response = await makeRequest(next(content, 'jsonld'));

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
  });

  it('should compact JSON-LD with a new context', async (): Promise<void> => {
    const context = {
      '@base': 'http://example.com',
      '@language': 'en',
      '@vocab': 'http://schema.org/',
      dc: 'http://purl.org/dc/elements/1.1/',
    };

    const response = await makeRequest(next(content, 'jsonld'), context);

    const contentType = parseContentType(response);
    const expected = {
      '@context': context,
      '@id': 'object',
      '@type': 'Article',
      name: 'English Name',
      'dc:title': ['English Title', { '@value': 'French Title', '@language': 'fr' }],
    };

    expect(response.type).toBe('application/ld+json');
    expect(contentType.type).toBe('application/ld+json');
    expect(contentType.parameters).toMatchObject({ profile: 'http://www.w3.org/ns/json-ld#compacted' });
    expect(response.body).toMatchObject(expected);
  });

  it('should do nothing if the response JSON-LD but the body is not an object', async (): Promise<void> => {
    const response = await makeRequest(next('text', 'jsonld'));

    const contentType = parseContentType(response);

    expect(response.type).toBe('application/ld+json');
    expect(contentType.type).toBe('application/ld+json');
    expect(contentType.parameters).toMatchObject({});
    expect(response.body).toBe('text');
  });

  it('should do nothing if the response JSON-LD but there is no body', async (): Promise<void> => {
    const response = await makeRequest(next(undefined, 'jsonld'));

    const contentType = parseContentType(response);

    expect(response.type).toBe('application/ld+json');
    expect(contentType.type).toBe('application/ld+json');
    expect(contentType.parameters).toMatchObject({});
    expect(response.body).toBe(undefined);
  });

  it('should do nothing if the response is not JSON-LD', async (): Promise<void> => {
    const response = await makeRequest(next(content, 'json'));

    const contentType = parseContentType(response);

    expect(response.type).toBe('application/json');
    expect(contentType.type).toBe('application/json');
    expect(contentType.parameters).not.toHaveProperty('profile');
    expect(response.body).toMatchObject(content);
  });
});
