import PersistArticles from './adaptors/persist-articles';
import createApp from './app';
import createRouter from './router';
import Routes from './routes';
import pgPromise = require('pg-promise');

const pgp = pgPromise();
const articles = new PersistArticles(pgp(process.env.DATABASE_CONNECTION_STRING));
const router = createRouter();
const apiDocumentationPath = router.url(Routes.ApiDocumentation);

const app = createApp(articles, router, apiDocumentationPath);

app.listen(8080);
