import InMemoryArticles from './adaptors/in-memory-articles';
import createApp from './app';
import createRouter from './router';
import Routes from './routes';

const articles = new InMemoryArticles();
const router = createRouter();
const apiDocumentationPath = router.url(Routes.ApiDocumentation);

const app = createApp(articles, router, apiDocumentationPath);

app.listen(8080);
