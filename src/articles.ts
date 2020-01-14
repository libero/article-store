import { DatasetCore, NamedNode } from 'rdf-js';

interface Articles extends AsyncIterable<[NamedNode, DatasetCore]> {
  set(id: NamedNode, article: DatasetCore): Promise<void>;

  get(id: NamedNode): Promise<DatasetCore>;

  remove(id: NamedNode): Promise<void>;

  contains(id: NamedNode): Promise<boolean>;

  count(): Promise<number>;
}

export default Articles;
