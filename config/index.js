const config = {
  port: process.env.PORT,
  dbConnectionString: process.env.DB_CONNECTION_STRING,
  jwtKey: process.env.JWT_KEY,
};

module.exports = config;