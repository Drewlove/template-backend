TRUNCATE TABLE app_user
RESTART IDENTITY CASCADE;

INSERT INTO app_user
  (first_name, last_name)
VALUES
  ('drew', 'love');