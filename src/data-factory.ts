import dataFactory from '@rdfjs/data-model';
import createDataset from 'rdf-dataset-indexed';
import { ExtendedDataFactory } from './middleware/dataset';

const extendedDataFactory: ExtendedDataFactory = { ...dataFactory, dataset: createDataset };

export const {
  dataset, blankNode, namedNode, literal, quad,
} = extendedDataFactory;

export default extendedDataFactory;
