const config = {
  port: process.env.PORT,
  dbConnectionString: process.env.DB_CONNECTION_STRING,
  jwtKey: process.env.JWT_KEY,
  dbConnectionStringTest: process.env.DB_CONNECTION_STRING_TEST,
  sendGrid: process.env.SENDGRID_API_KEY,
  senGridTemplateId: process.env.SENGRID_TEMPLATE_ID,
};

module.exports = config;
