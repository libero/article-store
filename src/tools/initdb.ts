import pgPromise from 'pg-promise';
import PostgresArticles from '../adaptors/postgres-articles';
import db from '../db';

(async (): Promise<void> => {
  await PostgresArticles.setupTable(pgPromise()(db));
})();
