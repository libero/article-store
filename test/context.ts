import Router, { RouterContext } from '@koa/router';
import { UnknownError } from 'http-errors';
import Koa, {
  Context, DefaultContext, DefaultContextExtends, DefaultStateExtends,
} from 'koa';
import { Request as IncomingMessage, Response as ServerResponse } from 'mock-http';
import { BaseQuad, DataFactory, DatasetCore } from 'rdf-js';
import InMemoryArticles from '../src/adaptors/in-memory-articles';
import { AppContext } from '../src/app';
import Articles from '../src/articles';
import dataFactory from '../src/data-factory';
import { DataFactoryContext } from '../src/middleware/data-factory';
import { DatasetContext, ExtendedDataFactory } from '../src/middleware/dataset';

export type ErrorListener = (error: UnknownError, context: Context) => void;

export type Headers = Record<string, string>;

type ContextOptions = {
  body?: string;
  errorListener?: ErrorListener;
  headers?: Headers;
  method?: string;
  path?: string;
};

type DataFactoryContextOptions<Factory extends DataFactory<BaseQuad> = DataFactory> = ContextOptions & {
  dataFactory: Factory;
};

type DatasetContextOptions = ContextOptions & {
  dataset?: DatasetCore;
};

type RouterContextOptions<State extends DefaultStateExtends = DefaultStateExtends,
Context extends DefaultContextExtends = DefaultContextExtends> = ContextOptions & {
  router: Router<State, Context>;
};

type AppOptions = DatasetContextOptions & {
  articles?: Articles;
};

const dummyRouter = {
  url(name: string): string {
    return `/path-to/${name}`;
  },
} as unknown as Router;

export const createContext = <Context extends DefaultContextExtends = DefaultContext>({
  body,
  errorListener,
  headers = {},
  method,
  path,
}: ContextOptions = {}): Context => {
  const app = new Koa();
  app.on('error', errorListener || jest.fn());

  const request = Object.create(app.request);
  request.app = app;
  request.req = new IncomingMessage({
    buffer: typeof body === 'string' ? Buffer.from(body) : undefined,
    headers: {
      ...headers,
      'content-length': typeof body === 'string' ? String(body.length) : undefined,
      host: 'example.com',
    },
    method,
    url: path,
  });

  const response = Object.create(app.response);
  response.req = request.req;
  response.res = new ServerResponse();

  return {
    app, method, path, request, response,
  } as unknown as Context;
};

export const createDataFactoryContext = <Factory extends DataFactory<BaseQuad> = DataFactory,
Context extends DataFactoryContext<DefaultContextExtends, Factory> = DataFactoryContext<DefaultContextExtends, Factory>>
  (options: DataFactoryContextOptions<Factory>): Context => {
  const context = createContext<Context>(options);

  context.dataFactory = options.dataFactory;

  return context;
};

export const createDatasetContext = <Context extends DatasetContext = DatasetContext>
  (options: DatasetContextOptions = {}): Context => {
  const context = createDataFactoryContext<ExtendedDataFactory, Context>({ ...options, dataFactory });

  context.request.dataset = options.dataset || context.dataFactory.dataset();
  context.response.dataset = context.dataFactory.dataset();

  return context;
};

export const createRouterContext = (options: RouterContextOptions): RouterContext => {
  const context = createContext<RouterContext>(options);

  context.router = options.router;

  return context;
};

export const createAppContext = (options: AppOptions = {}): AppContext => {
  const context = createDatasetContext<AppContext>(options);

  context.articles = options.articles || new InMemoryArticles();
  context.router = dummyRouter;

  return context;
};
