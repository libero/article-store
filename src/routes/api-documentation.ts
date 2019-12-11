import { constants } from 'http2';
import { Next } from 'koa';
import {
  hydra, owl, rdf, schema,
} from 'rdf-namespaces';
import { AppContext, AppMiddleware } from '../app';
import Routes from './index';

export default (): AppMiddleware => (
  async ({ request, response, router }: AppContext, next: Next): Promise<void> => {
    response.body = {
      '@context': {
        '@base': request.origin,
      },
      '@id': router.url(Routes.ApiDocumentation),
      '@type': hydra.ApiDocumentation,
      [hydra.entrypoint]: { '@id': router.url(Routes.EntryPoint) },
      [hydra.supportedClass]: [
        {
          '@id': schema.EntryPoint,
          '@type': hydra.Class,
          [hydra.title]: { '@value': 'API entry point', '@language': 'en' },
          [hydra.supportedOperation]: {
            '@type': [hydra.Operation, schema.ViewAction],
            [hydra.title]: { '@value': 'Get the entry point', '@language': 'en' },
            [hydra.method]: { '@value': 'GET' },
            [hydra.expects]: { '@id': owl.Nothing },
            [hydra.returns]: { '@id': schema.EntryPoint },
          },
          [hydra.supportedProperty]: [
            {
              '@type': hydra.SupportedProperty,
              [hydra.title]: { '@value': 'Name', '@language': 'en' },
              [hydra.property]: {
                '@id': schema.name,
                '@type': rdf.Property,
              },
              [hydra.required]: true,
              [hydra.readable]: true,
              [hydra.writeable]: false,
            },
          ],
        },
        {
          '@id': hydra.Collection,
          '@type': hydra.Class,
          [hydra.title]: { '@value': 'Collection', '@language': 'en' },
          [hydra.supportedOperation]: [
            {
              '@type': [hydra.Operation, schema.ViewAction],
              [hydra.title]: { '@value': 'Get the collection', '@language': 'en' },
              [hydra.method]: { '@value': 'GET' },
              [hydra.expects]: { '@id': owl.Nothing },
              [hydra.returns]: { '@id': hydra.Collection },
            },
            {
              '@type': [hydra.Operation, schema.AddAction],
              [hydra.title]: { '@value': 'Add an article', '@language': 'en' },
              [hydra.method]: { '@value': 'POST' },
              [hydra.expects]: { '@id': schema.Article },
              [hydra.returns]: { '@id': owl.Nothing },
              [hydra.possibleStatus]: [
                {
                  [hydra.statusCode]: constants.HTTP_STATUS_NO_CONTENT,
                  [hydra.description]: { '@value': 'If the article was added successfully', '@language': 'en' },
                },
              ],
            },
          ],
          [hydra.supportedProperty]: [
            {
              '@type': hydra.SupportedProperty,
              [hydra.title]: { '@value': 'Title', '@language': 'en' },
              [hydra.property]: {
                '@id': hydra.title,
                '@type': rdf.Property,
              },
              [hydra.readable]: true,
              [hydra.required]: true,
              [hydra.writeable]: false,
            },
            {
              '@type': hydra.SupportedProperty,
              [hydra.title]: { '@value': 'What the collection manages', '@language': 'en' },
              [hydra.property]: {
                '@id': 'http://www.w3.org/ns/hydra/core#manages',
                '@type': rdf.Property,
              },
              [hydra.readable]: true,
              [hydra.required]: true,
              [hydra.writeable]: false,
            },
            {
              '@type': hydra.SupportedProperty,
              [hydra.title]: { '@value': 'Total items', '@language': 'en' },
              [hydra.property]: {
                '@id': hydra.totalItems,
                '@type': rdf.Property,
              },
              [hydra.readable]: true,
              [hydra.required]: true,
              [hydra.writeable]: false,
            },
            {
              '@type': hydra.SupportedProperty,
              [hydra.title]: { '@value': 'Members of this collection', '@language': 'en' },
              [hydra.property]: {
                '@id': hydra.member,
                '@type': [rdf.Property, hydra.Link],
              },
              [hydra.readable]: true,
              [hydra.required]: false,
              [hydra.writeable]: false,
            },
          ],
        },
        {
          '@id': schema.Article,
          '@type': hydra.Class,
          [hydra.title]: { '@value': 'Article', '@language': 'en' },
          [hydra.supportedProperty]: [
            {
              '@type': hydra.SupportedProperty,
              [hydra.title]: { '@value': 'Title', '@language': 'en' },
              [hydra.property]: {
                '@id': schema.name,
                '@type': rdf.Property,
              },
              [hydra.required]: true,
              [hydra.readable]: true,
              [hydra.writeable]: true,
            },
          ],
        },
      ],
    };
    response.type = 'jsonld';

    await next();
  }
);
