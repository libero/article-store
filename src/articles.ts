import { DatasetCore, Quad_Subject as QuadSubject } from 'rdf-js';

interface Articles extends Iterable<[QuadSubject, DatasetCore]> {
  set(id: QuadSubject, article: DatasetCore): Promise<void>;

  get(id: QuadSubject): Promise<DatasetCore>;

  remove(id: QuadSubject): Promise<void>;

  contains(id: QuadSubject): Promise<boolean>;

  count(): Promise<number>;
}

export default Articles;
