DROP TYPE IF EXISTS article_category;

CREATE TYPE article_category AS ENUM (
    'Listicle',
    'How-to',
    'News',
    'Interview',
    'Story'
);

ALTER TABLE articles
  ADD COLUMN
    style article_category;