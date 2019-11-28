import Layer from '@koa/router/lib/layer';
import createRouter from '../src/router';
import Routes from '../src/routes';
import InMemoryArticles from '../src/adaptors/in-memory-articles';

describe('router', (): void => {
  const router = createRouter(new InMemoryArticles());

  Object.keys(Routes).forEach((name: string): void => {
    it(`has a route named ${name}`, (): void => {
      expect(router.route(Routes[name])).toBeInstanceOf(Layer);
    });
  });
});
