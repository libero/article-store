import {
  DatasetCore, Literal, NamedNode, Quad_Subject as QuadSubject,
} from 'rdf-js';
import {
  blankNode, dataset, literal, quad,
} from '../src/data-factory';
import { rdf, schema } from '../src/namespaces';

type Options = {
  id?: QuadSubject;
  name?: Literal | null;
  types?: Array<NamedNode>;
};

export default ({
  id = blankNode(),
  name = literal('Article'),
  types = [schema.Article],
}: Options = {}): DatasetCore => {
  const article = dataset();

  types.forEach((type: NamedNode): void => {
    article.add(quad(id, rdf.type, type));
  });

  if (name) {
    article.add(quad(id, schema('name'), name));
  }

  return article;
};
