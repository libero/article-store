import type { ConnectionConfig } from 'pg';

const config: Readonly<ConnectionConfig> = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT ? +process.env.DATABASE_PORT : undefined,
};

export default config;
