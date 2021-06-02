module.exports = {
  PORT: process.env.PORT || 9000,
  NODE_ENV: process.env.NODE_ENV || "development",
  API_TOKEN: process.env.API_TOKEN || "dummy-api-token",
  DATABASE_URL:
    process.env.DATABASE_URL || "postgresql://postgres@localhost/template",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL || "postgresql://postgres@localhost/template",
  DATABASE_NAME: "template",
  PROJECT_FOLDER_NAME: "template-backend",
};
