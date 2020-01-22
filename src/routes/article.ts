import clownface from 'clownface';
import createHttpError from 'http-errors';
import { OK } from 'http-status-codes';
import { addAll } from 'rdf-dataset-ext';
import {
  DefaultStateExtends, Middleware, Next,
} from 'koa';
import url from 'url';
import Articles from '../articles';
import { namedNode } from '../data-factory';
import ArticleNotFound from '../errors/article-not-found';
import { DatasetContext } from '../middleware/dataset';

export default (articles: Articles): Middleware<DefaultStateExtends, DatasetContext> => (
  async ({ request, response }: DatasetContext, next: Next): Promise<void> => {
    try {
      await next();
    } catch (error) {
      if (error instanceof createHttpError.NotFound) {
        const articleNamedNode = namedNode(url.resolve(request.origin, request.url));
        let article;
        try {
          article = await articles.get(articleNamedNode);
        } catch (getError) {
          if (getError instanceof ArticleNotFound) {
            throw new createHttpError.NotFound(getError.message);
          }

          throw getError;
        }
        const graph = clownface({
          dataset: response.dataset,
          term: articleNamedNode,
        });
        addAll(graph.dataset, article);
        response.status = OK;
      } else {
        throw error;
      }
    }
  }
);
