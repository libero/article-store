import {
  DefaultContext, DefaultState, Middleware, Next, Request, Response,
} from 'koa';
import { DatasetCore, DatasetCoreFactory } from 'rdf-js';
import { DataFactoryContext } from './data-factory';

export type WithDataset<T extends Request | Response> = T & {
  dataset: DatasetCore;
};

export type DatasetContext<CustomT = DefaultContext> = CustomT & DataFactoryContext<{
  request: WithDataset<Request>;
  response: WithDataset<Response>;
}, DatasetCoreFactory>;

export default (): Middleware<DefaultState, DatasetContext> => (
  async (context: DatasetContext, next: Next): Promise<void> => {
    Object.assign(context.request, { dataset: context.dataFactory.dataset() });
    Object.assign(context.response, { dataset: context.dataFactory.dataset() });

    await next();
  }
);
