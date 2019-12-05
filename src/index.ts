import InMemoryArticles from './adaptors/in-memory-articles';
import createApp from './app';

const articles = new InMemoryArticles();

const app = createApp({ articles });

app.listen(8080);
