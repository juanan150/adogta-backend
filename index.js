require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();

<<<<<<< HEAD
const routes = require("./routers/routes");
const config = require("./config");
=======
const config = require("./config");
const api = require("./api");
>>>>>>> 3c9be2e981e39005efb4e06143440d74aca54e3d

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
