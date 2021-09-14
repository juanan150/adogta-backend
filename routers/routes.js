const express = require("express");
const controllers = require("../controllers/controllers");
const { auth } = require("../middlewares/middlewares");
const app = express.Router();

app.get("/me", auth, controllers.loadUser);
app.post("/login", controllers.login);

module.exports = app;
