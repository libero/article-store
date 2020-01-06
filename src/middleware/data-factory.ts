import {
  DefaultContext, DefaultState, Middleware, Next,
} from 'koa';
import { DataFactory } from 'rdf-js';

export type DataFactoryContext<Context extends DefaultContext = DefaultContext,
  Factory extends DataFactory = DataFactory> = Context & { dataFactory: Factory };

export default <Factory extends DataFactory>(dataFactory: Factory):
  Middleware<DefaultState, DataFactoryContext<{}, Factory>> => (
  async (context: DataFactoryContext<{}, Factory>, next: Next): Promise<void> => {
    Object.assign(context, { dataFactory });

    await next();
  }
);
