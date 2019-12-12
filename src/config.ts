import { Config as KnexConfig } from 'knex';
import { readFileSync } from 'fs';

interface Config {
    database: {
        host: string;
        port: number;
        database: string;
        username: string;
        password: string;
    };
}

const configPath = process.env.CONFIG_PATH ? process.env.CONFIG_PATH : '/app/config/config.json';
const config: Config = JSON.parse(readFileSync(configPath, 'utf8'));

const knexConfig: KnexConfig = {
  client: 'pg',
  // In production we should use postgres pools.
  connection: {
    host: config.database.host,
    database: config.database.database,
    user: config.database.username,
    password: config.database.password,
    port: config.database.port,
  },
};

export type ConfigType = {
    knex: KnexConfig;
};

export const serviceConfig: ConfigType = {
  knex: knexConfig,
};

export default serviceConfig;
