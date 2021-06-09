TRUNCATE TABLE app_user
RESTART IDENTITY CASCADE;

INSERT INTO app_user
  (first_name, last_name, auth0_sub)
VALUES
  ('drew, davidandrewlove84@gmail.com', 'love', '60b7f40ec3cd820068a2008d');