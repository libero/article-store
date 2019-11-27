import { JsonLdObj, Iri } from 'jsonld/jsonld-spec';
import Articles from './articles';

export default class NullArticles implements Articles {
  [Symbol.iterator](): Iterator<JsonLdObj> {
    return {
      next(): IteratorResult<JsonLdObj> {
        return {
          done: true,
          value: undefined,
        };
      },
    };
  }

  async count(): Promise<number> {
    return 0;
  }

  async get(id: Iri): Promise<JsonLdObj> {
    throw new RangeError(`An article with the ID ${id} could not be found`);
  }

  async set(node: JsonLdObj): Promise<void> {
    throw new Error('Unable to add an article');
  }

  async delete(id: Iri): Promise<void> {

  }

  async has(id: Iri): Promise<boolean> {
    return false;
  }
}
