import cors from '@koa/cors';
import Router from '@koa/router';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import Articles from './articles';
import apiDocumentation from './middleware/api-documentation';
import errorHandler from './middleware/error-handler';
import routing from './middleware/routing';
import Routes from './routes';
import addArticle from './routes/add-article';
import articleList from './routes/article-list';
import entryPoint from './routes/entry-point';

type LocalContext = {
  articles: Articles;
}

const createRouter = (articles: Articles): Router => {
  const router = new Router();

  router.get(Routes.ApiDocumentation, '/doc', apiDocumentation(router));
  router.get(Routes.ArticleList, '/articles', articleList(articles, router));
  router.post(Routes.AddArticle, '/articles', addArticle(articles));
  router.get(Routes.EntryPoint, '/', entryPoint(router));

  return router;
};

export default ({ articles }: LocalContext): Koa => {
  const app = new Koa();
  const router = createRouter(articles);

  app.use(logger());
  app.use(bodyParser({
    extendTypes: {
      json: ['application/ld+json'],
    },
  }));
  app.use(cors({
    exposeHeaders: ['Link'],
  }));
  app.use(apiDocumentation(router));
  app.use(errorHandler());
  app.use(routing(router));

  return app;
};
