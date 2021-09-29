const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Adogta API with Swagger",
      version: "0.1.0",
      description:
        "This is the Adogta API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Top v-10 Team",
        url: "https://top-app-kappa.vercel.app/",
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development server",
      },
    ],
  },
  apis: ["./routers/routes.js"],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = {
  server: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerSpec),
};
