-- Drops articles table
DROP TABLE IF EXISTS articles;

-- Creates articles table
CREATE TABLE IF NOT EXISTS articles (
    uuid uuid NOT NULL,
    article jsonb NOT NULL,
    created time without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
