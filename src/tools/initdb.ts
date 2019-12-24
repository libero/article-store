import pgPromise, { IBaseProtocol, IMain } from 'pg-promise';
import db from '../db';

const init = async (database: IBaseProtocol<IMain>): Promise<void> => {
  await database.none('DROP TABLE IF EXISTS articles').then(() => {
    database.none(`CREATE TABLE IF NOT EXISTS articles (
      uuid uuid NOT NULL,
      article jsonb NOT NULL,
      created time without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`);
  });
};

init(pgPromise()(db));
