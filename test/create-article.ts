import { blankNode, literal, quad } from '@rdfjs/data-model';
import { dataset } from '@rdfjs/dataset';
import { DatasetCore, Quad_Subject as QuadSubject } from 'rdf-js';
import { rdf, schema } from '../src/namespaces';

export default (id: QuadSubject = blankNode(), name = literal(`Article ${id.value}`)): DatasetCore => (
  dataset([
    quad(id, rdf.type, schema.Article),
    quad(id, schema.name, name),
  ])
);
