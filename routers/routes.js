const express = require("express");
const app = express.Router();
const createUser = require("../controllers/controllers");

app.post("/signup", createUser);

module.exports = app;
