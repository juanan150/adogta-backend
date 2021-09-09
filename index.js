require("dotenv").config();
const routes = require("./routers/routes");

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();

const config = require("./config");

app.use(cors());
app.use(express.json());
app.use(routes);

mongoose.connect(config.dbConnectionString, console.log("Connected to db"));

mongoose.connection.on("error", function (e) {
  console.error(e);
});

app.listen(config.port, () => {
  console.log("Servidor iniciado ...");
});
