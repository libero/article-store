import dataFactory from '@rdfjs/data-model';
import 'jest-rdf';
import setDataFactory, { DataFactoryContext } from '../../src/middleware/data-factory';
import createContext from '../context';

const makeRequest = async (): Promise<DataFactoryContext> => {
  const context = createContext();

  await setDataFactory(dataFactory)(context, jest.fn());

  return context;
};

describe('Data factory middleware', (): void => {
  it('adds a data factory to the context', async (): Promise<void> => {
    const { dataFactory: actual } = await makeRequest();

    expect(actual).toBe(dataFactory);
  });
});
