import Router from '@koa/router';
import { Context, Middleware, Next } from 'koa';
import { DataFactory } from 'rdf-js';
import { storeStream } from 'rdf-store-stream';
import url from 'url';
import streamifyArray from 'streamify-array';
import { hydra, rdf, schema } from '../namespaces';
import Routes from './index';

export default (router: Router, { namedNode, literal, quad }: DataFactory): Middleware => (
  async ({ request, response }: Context, next: Next): Promise<void> => {
    const articleList = namedNode(url.resolve(request.origin, router.url(Routes.ArticleList)));
    const entryPoint = namedNode(url.resolve(request.origin, router.url(Routes.EntryPoint)));

    const quads = [
      quad(entryPoint, rdf('type'), schema('EntryPoint')),
      quad(entryPoint, schema('name'), literal('Article Store', 'en')),
      quad(entryPoint, hydra('collection'), articleList),
      quad(articleList, rdf('type'), hydra('Collection')),
    ];

    response.body = await storeStream(streamifyArray(quads));

    await next();
  }
);
