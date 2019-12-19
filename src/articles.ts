import { BlankNode, DatasetCore } from 'rdf-js';

interface Articles extends AsyncIterable<[BlankNode, DatasetCore]> {
  set(id: BlankNode, article: DatasetCore): Promise<void>;

  get(id: BlankNode): Promise<DatasetCore>;

  remove(id: BlankNode): Promise<void>;

  contains(id: BlankNode): Promise<boolean>;

  count(): Promise<number>;
}

export default Articles;
