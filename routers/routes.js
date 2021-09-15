const express = require("express");

const controllers = require("../controllers/controllers");

const app = express.Router();

app.delete("/pets/:id", controllers.destroyPet);
app.get("/foundations/:id/pets", controllers.listPets);
app.post("/foundations/:foundationId/pets", controllers.createPet);
app.post("/signup", controllers.createUser);

module.exports = app;
