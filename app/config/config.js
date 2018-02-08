const config = {
  port: process.env.PORT || 2000,
  db: process.env.MONGO_URI || 'mongodb://localhost/todoapi',
  test_port: 2001,
  test_db: 'mongodb://localhost/todoapi_test',
};

module.exports = config;
