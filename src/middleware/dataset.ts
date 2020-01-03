import {
  DefaultContext, DefaultState, Middleware, Next, Request, Response,
} from 'koa';
import { DatasetCore, DatasetCoreFactory } from 'rdf-js';
import { DataFactoryContext } from './data-factory';

export type WithDataset<T extends Request | Response> = T & {
  dataset: DatasetCore;
};

export type DatasetContext<CustomT = DefaultContext> = CustomT & DataFactoryContext<{
  datasetFactory: DatasetCoreFactory;
  request: WithDataset<Request>;
  response: WithDataset<Response>;
}>;

export default (datasetFactory: DatasetCoreFactory): Middleware<DefaultState, DatasetContext> => (
  async (context: DatasetContext, next: Next): Promise<void> => {
    Object.assign(context, { datasetFactory });
    Object.assign(context.request, { dataset: datasetFactory.dataset() });
    Object.assign(context.response, { dataset: datasetFactory.dataset() });

    await next();
  }
);
