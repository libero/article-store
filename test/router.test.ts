import createRouter, { Routes } from '../src/router';

describe('router', (): void => {
  const router = createRouter();

  Object.entries(Routes).forEach(([key, value]) => {
    it(`has a route named ${key}`, (): void => {
      expect(router.route(value)).toBeTruthy();
    });
  });
});
