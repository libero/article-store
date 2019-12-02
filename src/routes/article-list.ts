import Router from '@koa/router';
import { Context, Middleware, Next } from 'koa';
import { Store as N3Store } from 'n3';
import { DataFactory, Quad, Store } from 'rdf-js';
import url from 'url';
import { toArray } from '../../test/rdf';
import { hydra, rdf, schema } from '../namespaces';
import Routes from './index';

export default (
  articles: Store,
  router: Router,
  {
    blankNode, namedNode, literal, quad,
  }: DataFactory,
): Middleware => (
  async ({ request, response }: Context, next: Next): Promise<void> => {
    const articleList = namedNode(url.resolve(request.origin, router.url(Routes.ArticleList)));

    const manages = blankNode('manages');

    const quads = [
      quad(articleList, rdf('type'), hydra('Collection')),
      quad(articleList, hydra('title'), literal('List of articles', 'en')),
      quad(articleList, hydra('manages'), manages),
      quad(manages, hydra('property'), rdf('type')),
      quad(manages, hydra('object'), schema('Article')),
    ];
    const found = await toArray(articles.match(null, rdf('type'), schema('Article')));

    const newQuads = found.reduce(
      async (carryPromise: Promise<Array<Quad>>, { subject }: Quad): Promise<Array<Quad>> => {
        const carry = await carryPromise;

        carry.push(quad(articleList, hydra('member'), subject));

        (await toArray(articles.match(null, null, null, subject)))
          .forEach(({ predicate, object }: Quad): void => {
            carry.push(quad(subject, predicate, object));
          });

        return carry;
      }, Promise.resolve(quads),
    );

    response.body = new N3Store(await newQuads);

    await next();
  }
);
