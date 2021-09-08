require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();

const routes = require("./api/routers/routes");
const config = require("./config");

app.use(cors());
app.use(express.json());

mongoose.connect(config.dbConnectionString, console.log("Connected to db"));

mongoose.connection.on("error", function (e) {
  console.error(e);
});

//test
app.get("/", (request, response) => {
  response.send("uno, dos, tres...");
});

//test
app.use(routes);

//manage errors
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(config.port, () => {
  console.log("Servidor iniciado ...");
});
