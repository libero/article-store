import createDataset from 'rdf-dataset-indexed';
import { DatasetCoreFactory } from 'rdf-js';

const datasetFactory: DatasetCoreFactory = { dataset: createDataset };

export default datasetFactory;
