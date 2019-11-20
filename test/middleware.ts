import { RouterContext } from '@koa/router';
import {
  DefaultState, Middleware, ParameterizedContext, Response,
} from 'koa';

export type Next<StateT = DefaultState, CustomT = RouterContext> = (
  context: ParameterizedContext<StateT, CustomT>
) => Promise<void>;

export default async <StateT = DefaultState, CustomT = RouterContext>(
  middleware: Middleware<StateT, CustomT>,
  context: ParameterizedContext<StateT, CustomT>,
  next?: Next<StateT, CustomT>,
): Promise<Response> => {
  await middleware(context, next ? (): Promise<void> => next(context) : jest.fn());

  const { response } = context;

  return response;
};
