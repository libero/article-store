import { RouterContext } from '@koa/router';
import { DefaultState } from 'koa';
import Articles from './articles';

type AppContext = RouterContext<DefaultState, {
  articles: Articles;
}>;

export default AppContext;
