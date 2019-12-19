import { Middleware, ParameterizedContext, Response } from 'koa';
import { AppContext, AppState } from '../src/app';
import { WithDataset } from '../src/middleware/dataset';

export type Next<StateT = AppState, CustomT = AppContext> = (
  context: ParameterizedContext<StateT, CustomT>
) => Promise<void>;

export default async <StateT = AppState, CustomT = AppContext>(
  middleware: Middleware<StateT, CustomT>,
  context: ParameterizedContext<StateT, CustomT>,
  next?: Next<StateT, CustomT>,
): Promise<WithDataset<Response>> => {
  await middleware(context, next ? (): Promise<void> => next(context) : jest.fn());

  return context.response as WithDataset<Response>;
};
