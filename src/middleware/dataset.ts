import {
  DefaultContextExtends, DefaultStateExtends, ExtendableContext, Middleware, Next, Request, Response,
} from 'koa';
import {
  BaseQuad, DataFactory, DatasetCore, DatasetCoreFactory, Quad,
} from 'rdf-js';
import { DataFactoryContext } from './data-factory';

export type WithDataset<T extends Request | Response, Q extends BaseQuad = Quad> = T & { dataset: DatasetCore<Q> };

export type ExtendedDataFactory<Q extends BaseQuad = Quad> = DataFactory<Q> & DatasetCoreFactory<Q>;

export type DatasetContext<Context extends DefaultContextExtends = DefaultContextExtends, Q extends BaseQuad = Quad> =
  DataFactoryContext<Context & { request: WithDataset<Request, Q>; response: WithDataset<Response, Q> },
  ExtendedDataFactory<Q>>;

type LocalContext = DataFactoryContext<ExtendableContext, ExtendedDataFactory<BaseQuad>>;

export default (): Middleware<DefaultStateExtends, LocalContext> => (
  async (context: LocalContext, next: Next): Promise<void> => {
    Object.assign(context.request, { dataset: context.dataFactory.dataset() });
    Object.assign(context.response, { dataset: context.dataFactory.dataset() });

    await next();
  }
);
