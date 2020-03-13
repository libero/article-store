import { UnknownError } from 'http-errors';

export default <Type extends object>(error: UnknownError = 'error'): Type => (
  new Proxy(
    {} as Type,
    {
      get(): never {
        throw error;
      },
    },
  )
);
