import createRouter from '../src/router';
import Routes from '../src/routes';

describe('router', (): void => {
  const router = createRouter();

  Object.entries(Routes).forEach(([key, value]) => {
    it(`has a route named ${key}`, (): void => {
      expect(router.route(value)).toBeTruthy();
    });
  });
});
