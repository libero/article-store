import dataFactory from '@rdfjs/data-model';
import createDataset from 'rdf-dataset-indexed';
import type { DatasetCore, Quad } from 'rdf-js';
import type { ExtendedDataFactory } from './middleware/dataset';

const extendedDataFactory: ExtendedDataFactory = {
  ...dataFactory,
  dataset: (quads?: Array<Quad>): DatasetCore => createDataset(quads, extendedDataFactory),
};

export const {
  dataset, blankNode, namedNode, literal, quad,
} = extendedDataFactory;

export default extendedDataFactory;
