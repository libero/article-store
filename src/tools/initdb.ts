import pgPromise from 'pg-promise';
import db from '../db';
import PostgresArticles from '../adaptors/postgres-articles';

(async (): Promise<void> => {
  await PostgresArticles.setupTable(pgPromise()(db));
})();
