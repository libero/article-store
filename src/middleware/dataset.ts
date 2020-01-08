import {
  DefaultContextExtends, DefaultStateExtends, ExtendableContext, Middleware, Next, Request, Response,
} from 'koa';
import { DataFactory, DatasetCore, DatasetCoreFactory } from 'rdf-js';
import { DataFactoryContext } from './data-factory';

export type WithDataset<T extends Request | Response> = T & { dataset: DatasetCore };

export type ExtendedDataFactory = DataFactory & DatasetCoreFactory;

export type DatasetContext<Context extends DefaultContextExtends = DefaultContextExtends> =
  DataFactoryContext<Context & { request: WithDataset<Request>; response: WithDataset<Response> }, ExtendedDataFactory>;

export default (): Middleware<DefaultStateExtends, DataFactoryContext<ExtendableContext, ExtendedDataFactory>> => (
  async (context: DataFactoryContext<ExtendableContext, ExtendedDataFactory>, next: Next): Promise<void> => {
    Object.assign(context.request, { dataset: context.dataFactory.dataset() });
    Object.assign(context.response, { dataset: context.dataFactory.dataset() });

    await next();
  }
);
