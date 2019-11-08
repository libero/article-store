import indefinite from 'indefinite';
import createRouter, { Routes } from '../src/router';

describe('router', (): void => {
  const router = createRouter();

  Object.entries(Routes).forEach(([key, value]) => {
    it(`has ${indefinite(key)} route`, (): void => {
      expect(router.route(value)).toBeTruthy();
    });
  });
});
