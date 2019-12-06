import Layer from '@koa/router/lib/layer';
import createRouter from '../src/router';
import Routes from '../src/routes';

describe('router', (): void => {
  const router = createRouter();

  Object.keys(Routes).forEach((name: string): void => {
    it(`has a route named ${name}`, (): void => {
      expect(router.route(Routes[name])).toBeInstanceOf(Layer);
    });
  });
});
