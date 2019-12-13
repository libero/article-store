import { blankNode, literal, quad } from '@rdfjs/data-model';
import { dataset } from '@rdfjs/dataset';
import { BlankNode, DatasetCore } from 'rdf-js';
import { rdf, schema } from '../src/namespaces';

export default (id: BlankNode = blankNode(), name = literal(`Article ${id.value}`)): DatasetCore => (
  dataset([
    quad(id, rdf.type, schema.Article),
    quad(id, schema.name, name),
  ])
);
