const config = {
  port: process.env.PORT || 2000,
  db: process.env.MONGO_URI || 'mongodb://localhost/icarus',
  test_port: 2001,
  test_db: 'mongodb://localhost/icarus_test',
};

module.exports = config;
