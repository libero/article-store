import { RouterContext } from '@koa/router';
import Koa, { DefaultState, Middleware } from 'koa';
import Articles from './articles';

export type AppState = DefaultState;

export type AppContext = RouterContext<AppState, {
  articles: Articles;
}>;

export type AppMiddleware = Middleware<AppState, AppContext>;

type App = Koa<AppState, AppContext>;

export default App;
