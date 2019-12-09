import * as Knex from 'knex';

export default {
    up(knex: Knex): Knex.SchemaBuilder {
        return knex.schema.createTable('article-store', (table: Knex.TableBuilder) => {
            table.uuid('uuid').primary().unique().notNullable();
            table.jsonb('article').notNullable();
            table.timestamp('created').defaultTo(knex.fn.now());
        });
    },

    down(knex: Knex): Knex.SchemaBuilder {
        return knex.schema.dropTable('article-store');
    },
};
