import 'jest-rdf';
import { Next } from 'koa';
import dataset, { DatasetContext } from '../../src/middleware/dataset';
import createContext from '../context';

const makeRequest = async (next: Next = jest.fn()): Promise<DatasetContext> => {
  const context = createContext({ dataset: false });

  await dataset()(context, next);

  return context;
};

describe('Dataset middleware', (): void => {
  it('adds an empty dataset to the request', async (): Promise<void> => {
    const { request } = await makeRequest();

    expect(request.dataset).toBeRdfDatasetOfSize(0);
  });

  it('adds an empty dataset to the response', async (): Promise<void> => {
    const { response } = await makeRequest();

    expect(response.dataset).toBeRdfDatasetOfSize(0);
  });

  it('should call the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
