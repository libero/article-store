import Router from '@koa/router';
import Routes from './routes';
import apiDocumentation from './routes/api-documentation';
import articleList from './routes/article-list';
import entryPoint from './routes/entry-point';
import InMemoryArticles from './adaptors/in-memory-articles';
import Articles from './adaptors/articles';

export default (): Router => {
  const router = new Router();
  const articles: Articles = new InMemoryArticles();

  (async (): Promise<void> => {
      await Promise.all([
          articles.set({
              '@type': 'http://schema.org/Article',
              '@id': 'http://localhost:8081/articles/09560',
              'http://schema.org/name': 'Homo naledi, a new species of the genus Homo from the Dinaledi Chamber, South Africa',
          }),
          articles.set({
              '@type': 'http://schema.org/Article',
              '@id': 'http://localhost:8081/articles/24231',
              'http://schema.org/name': 'The age of Homo naledi and associated sediments in the Rising Star Cave, South Africa',
          }),
      ]);
  })();

  router.get(Routes.ApiDocumentation, '/doc', apiDocumentation(router));
  router.get(Routes.ArticleList, '/articles', articleList(articles, router));
  router.get(Routes.EntryPoint, '/', entryPoint(router));

  return router;
};
