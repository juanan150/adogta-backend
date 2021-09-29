require("dotenv").config();
const bb = require("express-busboy");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
const config = require("./config");
const routes = require("./routers/routes");

app.use(cors());
app.use(express.json());
bb.extend(app, {
  upload: true,
  path: "uploads",
  allowedPath: /./,
});
app.use(routes);

mongoose.connect(config.dbConnectionString, console.log("Connected to db"));

mongoose.connection.on("error", function (e) {
  console.error(e);
});

//routes that will be used
app.use(routes);

//manage errors
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(config.port, () => {
  console.log("Server started ...");
});
