import pgPromise, { IDatabase } from 'pg-promise';

const init = async (db: IDatabase<{}>): Promise<void> => {
  await db.none('DROP TABLE IF EXISTS articles').then(() => {
    db.none(`CREATE TABLE IF NOT EXISTS articles (
      uuid uuid NOT NULL,
      article jsonb NOT NULL,
      created time without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`);
  });
};

init(pgPromise()(process.env.DATABASE_CONNECTION_STRING));
