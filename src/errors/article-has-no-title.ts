import { schema } from 'rdf-namespaces';

export default class ArticleHasNoTitle extends Error {
  constructor() {
    super(`Article must have at least one ${schema.name}`);
  }
}
