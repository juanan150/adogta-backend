const express = require("express");
const app = express.Router();
const controllers = require("../controllers/controllers");

app.post("/signup", controllers.createUser);
module.exports = app;
