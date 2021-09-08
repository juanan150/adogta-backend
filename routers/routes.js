const express = require("express");

const tasksController = require("../controllers/tasksController");

const app = express.Router();

app.delete("/pets/:id", tasksController.destroyPet);

module.exports = app;
