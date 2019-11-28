import Router from '@koa/router';
import { Context, Middleware, Next } from 'koa';
import { DataFactory } from 'rdf-js';
import { toRdf } from 'rdf-literal';
import { storeStream } from 'rdf-store-stream';
import url from 'url';
import streamArray from 'stream-array';
import { hydra, rdf, schema } from '../namespaces';
import Routes from './index';

export default (
  router: Router,
  {
    blankNode, namedNode, literal, quad,
  }: DataFactory,
): Middleware => (
  async ({ request, response }: Context, next: Next): Promise<void> => {
    const articleList = namedNode(url.resolve(request.origin, router.url(Routes.ArticleList)));

    const manages = blankNode();
    const members = blankNode();

    const quads = [
      quad(articleList, rdf('type'), hydra('Collection')),
      quad(articleList, hydra('title'), literal('List of articles', 'en')),
      quad(articleList, hydra('manages'), manages),
      quad(manages, hydra('property'), rdf('type')),
      quad(manages, hydra('object'), schema('Article')),
      quad(articleList, hydra('totalItems'), toRdf(0)),
      quad(articleList, hydra('member'), members),
    ];

    response.body = await storeStream(streamArray(quads));

    await next();
  }
);
