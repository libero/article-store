import 'jest-rdf';
import { ExtendableContext, Next } from 'koa';
import dataFactory from '../../src/data-factory';
import dataset, { DatasetContext, ExtendedDataFactory } from '../../src/middleware/dataset';
import { createDataFactoryContext } from '../context';

const makeRequest = async (next: Next = jest.fn()): Promise<DatasetContext<ExtendableContext>> => {
  const context = createDataFactoryContext<ExtendedDataFactory, DatasetContext<ExtendableContext>>({ dataFactory });

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
