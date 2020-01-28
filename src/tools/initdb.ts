import pgPromise from 'pg-promise';
import db from '../db';
import PostgresArticles from '../adaptors/postgres-articles';

PostgresArticles.setupTable(pgPromise()(db));
