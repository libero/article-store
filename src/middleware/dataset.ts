import type {
  DefaultContextExtends, ExtendableContext, Next, Request, Response,
} from 'koa';
import type { Middleware } from 'koa-compose';
import type {
  BaseQuad, DataFactory, DatasetCore, DatasetCoreFactory, Quad,
} from 'rdf-js';
import type { DataFactoryContext } from './data-factory';

export type WithDataset<T extends Request | Response, Q extends BaseQuad = Quad> = T & { dataset: DatasetCore<Q> };

export type ExtendedDataFactory<Q extends BaseQuad = Quad> = DataFactory<Q> & DatasetCoreFactory<Q>;

export type DatasetContext<Context extends DefaultContextExtends = DefaultContextExtends, Q extends BaseQuad = Quad> =
  DataFactoryContext<Context & { request: WithDataset<Request, Q>; response: WithDataset<Response, Q> },
  ExtendedDataFactory<Q>>;

export default (): Middleware<DataFactoryContext<ExtendableContext, ExtendedDataFactory<BaseQuad>>> => (
  async (context: DataFactoryContext<ExtendableContext, ExtendedDataFactory<BaseQuad>>, next: Next): Promise<void> => {
    Object.assign(context.request, { dataset: context.dataFactory.dataset() });
    Object.assign(context.response, { dataset: context.dataFactory.dataset() });

    await next();
  }
);
