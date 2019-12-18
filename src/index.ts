import dataFactory from '@rdfjs/data-model';
import InMemoryArticles from './adaptors/in-memory-articles';
import createApp from './app';
import datasetFactory from './dataset-factory';
import createRouter from './router';
import Routes from './routes';

const articles = new InMemoryArticles();
const router = createRouter();
const apiDocumentationPath = router.url(Routes.ApiDocumentation);

const app = createApp(articles, router, apiDocumentationPath, dataFactory, datasetFactory);

app.listen(8080);
