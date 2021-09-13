const express = require("express");

const controllers = require("../controllers/controllers");

const app = express.Router();

app.get("/foundations", controllers.listFoundations);

module.exports = app;
