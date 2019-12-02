import {
  DefaultState, Middleware, ParameterizedContext, Response,
} from 'koa';
import AppContext from '../src/context';

export type Next<StateT = DefaultState, CustomT = AppContext> = (
  context: ParameterizedContext<StateT, CustomT>
) => Promise<void>;

export default async <StateT = DefaultState, CustomT = AppContext>(
  middleware: Middleware<StateT, CustomT>,
  context: ParameterizedContext<StateT, CustomT>,
  next?: Next<StateT, CustomT>,
): Promise<Response> => {
  await middleware(context, next ? (): Promise<void> => next(context) : jest.fn());

  const { response } = context;

  return response;
};
