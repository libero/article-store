import { Next } from 'koa';
import dataset, { DatasetContext } from '../../src/middleware/dataset';
import createContext from '../context';

const makeRequest = async (next: Next = jest.fn()): Promise<DatasetContext> => {
  const context = createContext();

  await dataset()(context, next);

  return context;
};

/**
 * @group unit
 */
describe('Dataset middleware', (): void => {
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
