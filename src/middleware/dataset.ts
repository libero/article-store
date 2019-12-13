import { Next } from 'koa';
// eslint-disable-next-line import/no-cycle
import { AppContext, AppMiddleware } from '../app';

export default (): AppMiddleware => (
  async ({ datasetFactory, request, response }: AppContext, next: Next): Promise<void> => {
    request.dataset = datasetFactory.dataset();
    response.dataset = datasetFactory.dataset();

    await next();
  }
);
