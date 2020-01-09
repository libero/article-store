import dataFactory from '@rdfjs/data-model';
import pgPromise from 'pg-promise';
import createApp from './app';
import dataFactory from './data-factory';
import createRouter from './router';
import PostgresArticles from './adaptors/postgres-articles';
import Routes from './routes';
import db from './db';

const articles = new PostgresArticles(pgPromise()(db));
const router = createRouter();
const apiDocumentationPath = router.url(Routes.ApiDocumentation);

const app = createApp(articles, router, apiDocumentationPath, dataFactory);

app.listen(8080);
