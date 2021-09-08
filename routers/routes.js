const express = require("express");

const tasksController = require("../controllers/tasksController");

const app = express.Router();

app.delete("/pets/:id", tasksController.destroyPets);
app.get("/foundations/:id/pets", tasksController.listPets);
app.post("/foundations/:foundationId/pets", tasksController.createPet);

module.exports = app;
