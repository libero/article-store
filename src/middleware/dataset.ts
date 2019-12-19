import {
  DefaultContext, DefaultState, Middleware, Next, Request, Response,
} from 'koa';
import { DatasetCore, DatasetCoreFactory } from 'rdf-js';

export type WithDataset<T extends Request | Response> = T & {
  dataset: DatasetCore;
};

export type DatasetContext<CustomT = DefaultContext> = CustomT & {
  request: WithDataset<Request>;
  response: WithDataset<Response>;
};

export default (datasetFactory: DatasetCoreFactory): Middleware<DefaultState, DatasetContext> => (
  async ({ request, response }: DatasetContext, next: Next): Promise<void> => {
    request.dataset = datasetFactory.dataset();
    response.dataset = datasetFactory.dataset();

    await next();
  }
);
