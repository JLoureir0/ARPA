DROP TABLE IF EXISTS user_allergy;

CREATE TABLE user_allergy(
  _id text PRIMARY KEY,
  intolerant text[],
  allergic text[]
);
