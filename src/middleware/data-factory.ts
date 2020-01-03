import {
  DefaultContext, DefaultState, Middleware, Next,
} from 'koa';
import { DataFactory } from 'rdf-js';

export type DataFactoryContext<CustomT = DefaultContext> = CustomT & {
  dataFactory: DataFactory;
};

export default (dataFactory: DataFactory): Middleware<DefaultState, DataFactoryContext> => (
  async (context: DataFactoryContext, next: Next): Promise<void> => {
    Object.assign(context, { dataFactory });

    await next();
  }
);
