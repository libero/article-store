import pgPromise from 'pg-promise';
import createApp from './app';
import createRouter from './router';
import PostgresArticles from './adaptors/postgres-articles';
import Routes from './routes';

const articles = new PostgresArticles(pgPromise()(process.env.DATABASE_CONNECTION_STRING));
const router = createRouter();
const apiDocumentationPath = router.url(Routes.ApiDocumentation);

const app = createApp(articles, router, apiDocumentationPath);

app.listen(8080);
