import { ExtendableContext } from 'koa';
import { Middleware } from 'koa-compose';

export type Next<CustomT extends ExtendableContext = ExtendableContext> =
  (context: CustomT) => Promise<void>;

export default async <CustomT extends ExtendableContext>(
  middleware: Middleware<CustomT>,
  context: CustomT,
  next?: Next<CustomT>,
): Promise<CustomT['response']> => {
  await middleware(context, next ? (): Promise<void> => next(context) : jest.fn());

  return context.response;
};
