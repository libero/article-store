import {
  DefaultContextExtends, DefaultStateExtends, Middleware, Next,
} from 'koa';
import { BaseQuad, DataFactory } from 'rdf-js';

export type DataFactoryContext<Context extends DefaultContextExtends = DefaultContextExtends,
  Factory extends DataFactory<BaseQuad> = DataFactory> = Context & { dataFactory: Factory };

export default (dataFactory: DataFactory<BaseQuad>): Middleware<DefaultStateExtends, DefaultContextExtends> => (
  async (context: DefaultContextExtends, next: Next): Promise<void> => {
    Object.assign(context, { dataFactory });

    await next();
  }
);
