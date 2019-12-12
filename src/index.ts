import Knex from 'knex';
import createApp from './app';
import createRouter from './router';
import Routes from './routes';
import PersistArticles from './adaptors/persist-articles';
import Config from './config';

const articles = new PersistArticles(Knex(Config.knex));
const router = createRouter();
const apiDocumentationPath = router.url(Routes.ApiDocumentation);

const app = createApp(articles, router, apiDocumentationPath);

app.listen(8080);
