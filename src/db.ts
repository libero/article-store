import { IConnectionParameters } from 'pg-promise/typescript/pg-subset';

export default {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
} as IConnectionParameters;
