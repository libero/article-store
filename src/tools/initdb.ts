import pgPromise from 'pg-promise';
import db from '../db';
import CreateDb from './create-db';

new CreateDb(pgPromise()(db)).init();
