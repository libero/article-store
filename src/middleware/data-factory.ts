import {
  DefaultContext, DefaultState, Middleware, Next,
} from 'koa';
import { DataFactory } from 'rdf-js';

export type DataFactoryContext<CustomT = DefaultContext,
  CustomF extends object = {}> = CustomT & { dataFactory: DataFactory & CustomF };

export default <CustomT = DefaultContext,
  CustomF extends object = {}>(dataFactory: DataFactory & CustomF):
  Middleware<DefaultState, DataFactoryContext<CustomT, DataFactory & CustomF>> => (
  async (context: DataFactoryContext<CustomT, DataFactory & CustomF>, next: Next):
    Promise<void> => {
    Object.assign(context, { dataFactory });

    await next();
  }
);
