const express = require("express");

const controllers = require("../controllers/controllers");

const app = express.Router();

app.delete("/pets/:id", controllers.destroyPet);

module.exports = app;
