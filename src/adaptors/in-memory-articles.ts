import {
  BlankNode, DatasetCore, Quad, Quad_Object as QuadObject,
} from 'rdf-js';
import Articles from '../articles';
import ArticleNotFound from '../errors/article-not-found';
import NotAnArticle from '../errors/not-an-article';
import { rdf, schema } from '../namespaces';

export default class InMemoryArticles implements Articles {
  private articles: { [id: string]: [BlankNode, DatasetCore] } = {};

  async set(id: BlankNode, article: DatasetCore): Promise<void> {
    if (article.match(id, rdf.type, schema.Article).size === 0) {
      const types = [...article.match(id, rdf.type)].map((quad: Quad): QuadObject => quad.object);
      throw new NotAnArticle(types);
    }

    this.articles[id.value] = [id, article];
  }

  async get(id: BlankNode): Promise<DatasetCore> {
    if (!(id.value in this.articles)) {
      throw new ArticleNotFound(id);
    }

    return this.articles[id.value][1];
  }

  async remove(id: BlankNode): Promise<void> {
    delete this.articles[id.value];
  }

  async contains(id: BlankNode): Promise<boolean> {
    return id.value in this.articles;
  }

  async count(): Promise<number> {
    return Object.values(this.articles).length;
  }

  * [Symbol.iterator](): Iterator<[BlankNode, DatasetCore]> {
    yield* Object.values(this.articles);
  }
}
