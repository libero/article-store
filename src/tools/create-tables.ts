import { IBaseProtocol, IMain } from 'pg-promise';

export default class CreateTables {
  private database: IBaseProtocol<IMain>;

  public constructor(database: IBaseProtocol<IMain>) {
    this.database = database;
  }

  async run(): Promise<void> {
    await this.database.none('DROP TABLE IF EXISTS articles');
    await this.database.none(`CREATE TABLE IF NOT EXISTS articles (
      uuid VARCHAR (32) NOT NULL UNIQUE,
      article jsonb NOT NULL,
      created time without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`);
  }
}
