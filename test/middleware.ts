import { Context, Middleware, Response } from 'koa';

export type Next = (context: Context) => Promise<void>;

export default async (middleware: Middleware, context: Context, next?: Next): Promise<Response> => {
  await middleware(context, next ? (): Promise<void> => next(context) : jest.fn());

  const { response } = context;

  return response;
};
