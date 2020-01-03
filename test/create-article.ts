import { termToString } from 'rdf-string';
import { blankNode, literal, quad } from '@rdfjs/data-model';
import { DatasetCore, Quad_Subject as QuadSubject } from 'rdf-js';
import datasetFactory from '../src/dataset-factory';
import { rdf, schema } from '../src/namespaces';

export default (id: QuadSubject = blankNode(), name = literal(`Article ${termToString(id)}`)): DatasetCore => (
  datasetFactory.dataset([
    quad(id, rdf.type, schema.Article),
    quad(id, schema('name'), name),
  ])
);
