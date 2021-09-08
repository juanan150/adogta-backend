const express = require("express");

const tasksController = require("../controllers/tasksController");

const app = express.Router();

app.delete("/pets/:id", tasksController.destroy);
app.get("/foundations/:id/pets", tasksController.listPets);

module.exports = app;
