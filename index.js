require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
const config = require("./config");
const routes = require("./routers/routes");

app.use(cors());
app.use(express.json());
app.use(routes);

process.env.NODE_ENV === "test"
  ? mongoose.connect(
      process.env.DB_CONNECTION_STRING_TEST,
      console.log("Connected to db-test")
    )
  : mongoose.connect(
      process.env.DB_CONNECTION_STRING,
      console.log("Connected to db")
    );

mongoose.connection.on("error", function (e) {
  console.error(e);
});

//routes that will be used
app.use(routes);

//manage errors
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

if (process.env.NODE_ENV === "start")
  app.listen(config.port, () => {
    console.log("Server started ...");
  });

module.exports = app;
