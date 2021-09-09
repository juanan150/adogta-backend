require("dotenv").config();
const usersRouter = require("./routers/users.routes");

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();

const config = require("./config");
const api = require("./api");

app.use(cors());
app.use(express.json());

app.use(usersRouter);

mongoose.connect(config.dbConnectionString, console.log("Connected to db"));

mongoose.connection.on("error", function (e) {
  console.error(e);
});

app.listen(config.port, () => {
  console.log("Servidor iniciado ...");
});
