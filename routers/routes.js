const express = require("express");
const controllers = require("../controllers/controllers");
const app = express.Router();

app.post("/login", controllers.login);

module.exports = app;
