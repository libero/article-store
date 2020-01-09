import pgPromise from 'pg-promise';
import db from '../db';
import CreateTables from './create-tables';

new CreateTables(pgPromise()(db)).run();
