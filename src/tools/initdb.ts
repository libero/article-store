import fs from 'fs-extra';
import { Client } from 'pg';

const init = async () => {
  // create an instance of the PostgreSQL client
  const client = new Client(process.env.DATABASE_CONNECTION_STRING);
  try {
    // connect to the local database server
    await client.connect();
    // read the contents of the initdb.pgsql file
    const sql = await fs.readFile(`${__dirname}/initdb.pgsql`, { encoding: 'UTF-8' });
    // split the file into separate statements
    const statements = sql.split(/;\s*$/m);
    for (const statement of statements) {
      if (statement.length > 3) {
        // execute each of the statements
        await client.query(statement);
      }
    }
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    // close the database client
    await client.end();
  }
};

init().then(() => {
  console.log('finished');
}).catch(() => {
  console.log('finished with errors');
});
