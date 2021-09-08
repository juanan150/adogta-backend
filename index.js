require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();

const routes = require("./routers/routes");
const config = require("./config");

app.use(cors());
app.use(express.json());

mongoose.connect(config.dbConnectionString);

//test
app.use(routes);

//manage errors
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(config.port, () => {
  console.log("Servidor iniciado ...");
});
