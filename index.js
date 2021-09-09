require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./routers/routes");

const config = require("./config");

app.use(cors());
app.use(express.json());

mongoose.connect(config.dbConnectionString, console.log("Connected to db"));

mongoose.connection.on("error", function (e) {
  console.error(e);
});

app.use(routes);

app.listen(config.port, () => {
  console.log("Servidor iniciado ...");
});
