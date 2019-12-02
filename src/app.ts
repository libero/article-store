import cors from '@koa/cors';
import Koa from 'koa';
import logger from 'koa-logger';
import { DataFactory, Store as N3Store } from 'n3';
import { Quad, Store } from 'rdf-js';
import streamArray from 'stream-array';
import apiDocumentation from './middleware/api-documentation';
import errorHandler from './middleware/error-handler';
import jsonld from './middleware/jsonld';
import routing from './middleware/routing';
import { rdf, schema } from './namespaces';
import createRouter from './router';

const app = new Koa();
const articles: Store = new N3Store();
const router = createRouter(articles, DataFactory);

function* createArticle(): Generator<Quad> {
  const articleId = DataFactory.blankNode();

  yield DataFactory.quad(articleId, rdf('type'), schema('Article'), articleId);
  yield DataFactory.quad(articleId, schema('name'), DataFactory.literal(`Article ${articleId.value}`, 'en'), articleId);
}

articles.import(streamArray([...createArticle(), ...createArticle(), ...createArticle()]));

app.use(logger());
app.use(cors({
  exposeHeaders: ['Link'],
}));
app.use(jsonld());
app.use(apiDocumentation(router));
app.use(errorHandler(DataFactory));
app.use(routing(router));

export default app;
