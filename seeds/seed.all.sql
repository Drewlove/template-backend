BEGIN;
\i /Users/Drew/Projects/boilerplate-api/seeds/001.seed.articles.sql
\i /Users/Drew/Projects/boilerplate-api/seeds/002.seed.users.sql

COMMIT;

-- SEED ALL, copy and paste: psql -f ~/Projects/boilerplate-api/seeds/seed.all.sql boilerplate;