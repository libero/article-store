import dataFactory from '@rdfjs/data-model';
import dataset from 'rdf-dataset-indexed';
import { DataFactory, DatasetCoreFactory } from 'rdf-js';

const datasetFactory: DataFactory & DatasetCoreFactory = { ...dataFactory, dataset };

export default datasetFactory;
