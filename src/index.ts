import dataFactory from '@rdfjs/data-model';
import createDataset from 'rdf-dataset-indexed';
import InMemoryArticles from './adaptors/in-memory-articles';
import createApp from './app';
import createRouter from './router';
import Routes from './routes';

const articles = new InMemoryArticles();
const router = createRouter();
const apiDocumentationPath = router.url(Routes.ApiDocumentation);
const datasetFactory = { dataset: createDataset };

const app = createApp(articles, router, apiDocumentationPath, dataFactory, datasetFactory);

app.listen(8080);
