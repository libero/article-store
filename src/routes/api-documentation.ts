import Router from '@koa/router';
import { Context, Middleware, Next } from 'koa';
import {
  hydra, owl, rdfs, schema,
} from 'rdf-namespaces';
import Routes from './index';

export default (router: Router): Middleware => (
  async ({ request, response }: Context, next: Next): Promise<void> => {
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
            '@type': hydra.Operation,
            [hydra.title]: { '@value': 'Get the entry point', '@language': 'en' },
            [hydra.method]: { '@value': 'GET' },
            [hydra.expects]: { '@id': owl.Nothing },
            [hydra.returns]: { '@id': schema.EntryPoint },
          },
          [hydra.supportedProperty]: [
            {
              '@type': hydra.SupportedProperty,
              [hydra.title]: { '@value': 'Name', '@language': 'en' },
              [hydra.property]: { '@id': schema.name },
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
          [hydra.supportedOperation]: {
            '@type': hydra.Operation,
            [hydra.title]: { '@value': 'Get the collection', '@language': 'en' },
            [hydra.method]: { '@value': 'GET' },
            [hydra.expects]: { '@id': owl.Nothing },
            [hydra.returns]: { '@id': hydra.Collection },
          },
          [hydra.supportedProperty]: [
            {
              '@type': hydra.SupportedProperty,
              [hydra.title]: { '@value': 'Title', '@language': 'en' },
              [hydra.property]: { '@id': rdfs.label },
              [hydra.readable]: true,
              [hydra.required]: true,
              [hydra.writeable]: false,
            },
            {
              '@type': hydra.SupportedProperty,
              [hydra.title]: { '@value': 'What the collection manages', '@language': 'en' },
              [hydra.property]: { '@id': 'http://www.w3.org/ns/hydra/core#manages' },
              [hydra.readable]: true,
              [hydra.required]: true,
              [hydra.writeable]: false,
            },
            {
              '@type': hydra.SupportedProperty,
              [hydra.title]: { '@value': 'Total items', '@language': 'en' },
              [hydra.property]: { '@id': hydra.totalItems },
              [hydra.readable]: true,
              [hydra.required]: true,
              [hydra.writeable]: false,
            },
            {
              '@type': hydra.SupportedProperty,
              [hydra.title]: { '@value': 'Members of this collection', '@language': 'en' },
              [hydra.property]: { '@id': hydra.member },
              [hydra.readable]: true,
              [hydra.required]: false,
              [hydra.writeable]: false,
            },
          ],
        },
      ],
    };
    response.type = 'jsonld';

    await next();
  }
);
