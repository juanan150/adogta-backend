const express = require("express");
const app = express.Router();
const createUser = require("../controllers/user");

app.post("/signup", createUser);

module.exports = app;
