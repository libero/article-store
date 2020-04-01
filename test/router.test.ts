import createRouter from '../src/router';
import Routes from '../src/routes';

describe('router', (): void => {
  const router = createRouter();

  it.each(Object.values(Routes))('has a route named %s', async (name: string): Promise<void> => {
    expect(router.route(name)).toMatchObject({ name });
  });
});
