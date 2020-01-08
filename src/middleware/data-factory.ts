import {
  DefaultContextExtends, DefaultStateExtends, Middleware, Next,
} from 'koa';
import { DataFactory } from 'rdf-js';

export type DataFactoryContext<Context extends DefaultContextExtends = DefaultContextExtends,
  Factory extends DataFactory = DataFactory> = Context & { dataFactory: Factory };

export default (dataFactory: DataFactory): Middleware<DefaultStateExtends, DefaultContextExtends> => (
  async (context: DefaultContextExtends, next: Next): Promise<void> => {
    Object.assign(context, { dataFactory });

    await next();
  }
);
