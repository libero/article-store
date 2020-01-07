import {
  DefaultContext, DefaultState, Middleware, Next, Request, Response,
} from 'koa';
import { DataFactory, DatasetCore, DatasetCoreFactory } from 'rdf-js';
import { DataFactoryContext } from './data-factory';

export type WithDataset<T extends Request | Response> = T & {
  dataset: DatasetCore;
};

export type ExtendedDataFactory = DataFactory & DatasetCoreFactory;

export type DatasetContext<Context = DefaultContext> = DataFactoryContext<Context & {
  request: WithDataset<Request>;
  response: WithDataset<Response>;
}, ExtendedDataFactory>;

export default (): Middleware<DefaultState, DatasetContext> => (
  async (context: DatasetContext, next: Next): Promise<void> => {
    Object.assign(context.request, { dataset: context.dataFactory.dataset() });
    Object.assign(context.response, { dataset: context.dataFactory.dataset() });

    await next();
  }
);
