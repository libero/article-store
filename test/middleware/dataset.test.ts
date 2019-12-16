import 'jest-rdf';
import { AppContext } from '../../src/app';
import dataset from '../../src/middleware/dataset';
import createContext, { Headers } from '../context';

const makeRequest = async (body?: string, headers?: Headers): Promise<AppContext> => {
  const context = createContext({ body, headers, method: body ? 'POST' : 'GET' });

  await dataset()(context, jest.fn());

  return context;
};

describe('Dataset middleware', (): void => {
  it('adds an empty dataset to the request', async (): Promise<void> => {
    const { request } = await makeRequest();

    expect(request.dataset.size).toBe(0);
  });

  it('adds an empty dataset to the response', async (): Promise<void> => {
    const { response } = await makeRequest();

    expect(response.dataset.size).toBe(0);
  });
});
