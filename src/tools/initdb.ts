import pgPromise, { IBaseProtocol, IMain } from 'pg-promise';

const init = async (db: IBaseProtocol<IMain>): Promise<void> => {
  await db.none('DROP TABLE IF EXISTS articles').then(() => {
    db.none(`CREATE TABLE IF NOT EXISTS articles (
      uuid uuid NOT NULL,
      article jsonb NOT NULL,
      created time without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`);
  });
};

init(pgPromise()({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
}));
