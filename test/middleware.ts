import { UnknownError } from 'http-errors';
import { ExtendableContext } from 'koa';
import { Middleware } from 'koa-compose';
import { AppContext } from '../src/app';

export type NextMiddleware<CustomT extends ExtendableContext = AppContext> =
  (context: CustomT) => Promise<void>;

export const throwingNext = <CustomT extends ExtendableContext = AppContext>
  (error: UnknownError = new Error()): NextMiddleware<CustomT> => (): never => {
    throw error; // eslint-disable-line @typescript-eslint/no-throw-literal
  };

export default async <CustomT extends ExtendableContext>(
  middleware: Middleware<CustomT>,
  context: CustomT,
  next?: NextMiddleware<CustomT>,
): Promise<CustomT['response']> => {
  await middleware(context, next ? (): Promise<void> => next(context) : jest.fn());

  return context.response;
};
