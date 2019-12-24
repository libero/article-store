import pgPromise from 'pg-promise';
import createApp from './app';
import createRouter from './router';
import PostgresArticles from './adaptors/postgres-articles';
import Routes from './routes';

const articles = new PostgresArticles(pgPromise()({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
}));
const router = createRouter();
const apiDocumentationPath = router.url(Routes.ApiDocumentation);

const app = createApp(articles, router, apiDocumentationPath);

app.listen(8080);
