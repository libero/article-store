import dataFactory from '@rdfjs/data-model';
import { Next } from 'koa';
import setDataFactory, { DataFactoryContext } from '../../src/middleware/data-factory';
import { createContext } from '../context';

const makeRequest = async (next: Next = jest.fn()): Promise<DataFactoryContext> => {
  const context = createContext<DataFactoryContext>();

  await setDataFactory(dataFactory)(context, next);

  return context;
};

describe('Data factory middleware', (): void => {
  it('adds a data factory to the context', async (): Promise<void> => {
    const { dataFactory: actual } = await makeRequest();

    expect(actual).toBe(dataFactory);
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
