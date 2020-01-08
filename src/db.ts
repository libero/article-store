import { IConnectionParameters } from 'pg-promise/typescript/pg-subset';

export default (process.env.DATABASE_URL) ? {
  connectionString: process.env.DATABASE_URL,
} : {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
} as IConnectionParameters;
