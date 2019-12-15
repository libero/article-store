import fs from 'fs-extra';
import { Client } from 'pg';

const init = async (): Promise<void> => {
  const client = new Client(process.env.DATABASE_CONNECTION_STRING);
  try {
    await client.connect();
    await client.query(await fs.readFile(`${__dirname}/initdb.pgsql`, { encoding: 'UTF-8' }));
  } finally {
    await client.end();
  }
};

init();
