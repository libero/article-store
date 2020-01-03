import { Next } from 'koa';
import datasetFactory from '../../src/dataset-factory';
import dataset, { DatasetContext } from '../../src/middleware/dataset';
import createContext from '../context';

const makeRequest = async (next: Next = jest.fn()): Promise<DatasetContext> => {
  const context = createContext();

  await dataset(datasetFactory)(context, next);

  return context;
};

describe('Dataset middleware', (): void => {
  it('adds a dataset factory to the context', async (): Promise<void> => {
    const { datasetFactory: actual } = await makeRequest();

    expect(actual).toBe(datasetFactory);
  });

  it('adds an empty dataset to the request', async (): Promise<void> => {
    const { request } = await makeRequest();

    expect(request.dataset.size).toBe(0);
  });

  it('adds an empty dataset to the response', async (): Promise<void> => {
    const { response } = await makeRequest();

    expect(response.dataset.size).toBe(0);
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
