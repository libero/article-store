import {
  Context, Middleware, Next, Response,
} from 'koa';

export default async (middleware: Middleware, context: Context, next?: Next): Promise<Response> => {
  await middleware(context, next || jest.fn());

  const { response } = context;

  return response;
};
