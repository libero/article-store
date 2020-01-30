import {
  DatasetCore, NamedNode, Quad, Quad_Object as QuadObject,
} from 'rdf-js';
import Articles from '../articles';
import ArticleNotFound from '../errors/article-not-found';
import NotAnArticle from '../errors/not-an-article';
import { rdf, schema } from '../namespaces';

export default class InMemoryArticles implements Articles {
  private articles: { [id: string]: [NamedNode, DatasetCore] } = {};

  async set(id: NamedNode, article: DatasetCore): Promise<void> {
    if (article.match(id, rdf.type, schema.Article).size === 0) {
      throw new NotAnArticle([...article.match(id, rdf.type)].map((quad: Quad): QuadObject => quad.object));
    }

    this.articles[id.value] = [id, article];
  }

  async get(id: NamedNode): Promise<DatasetCore> {
    if (!(id.value in this.articles)) {
      throw new ArticleNotFound(id);
    }

    return this.articles[id.value][1];
  }

  async remove(id: NamedNode): Promise<void> {
    delete this.articles[id.value];
  }

  async contains(id: NamedNode): Promise<boolean> {
    return id.value in this.articles;
  }

  async count(): Promise<number> {
    return Object.values(this.articles).length;
  }

  async* [Symbol.asyncIterator](): AsyncIterator<[NamedNode, DatasetCore]> {
    yield* Object.values(this.articles);
  }
}
