import {
  DefaultContext, DefaultState, Middleware, Next,
} from 'koa';
import { DataFactory } from 'rdf-js';

export type DataFactoryContext<CustomT extends object = DefaultContext,
  CustomF extends DataFactory = DataFactory> = CustomT & { dataFactory: CustomF };

export default <CustomF extends DataFactory>(dataFactory: CustomF):
  Middleware<DefaultState, DataFactoryContext<{}, CustomF>> => (
  async (context: DataFactoryContext<{}, CustomF>, next: Next): Promise<void> => {
    Object.assign(context, { dataFactory });

    await next();
  }
);
