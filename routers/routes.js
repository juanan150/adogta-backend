const express = require("express");

const controllers = require("../controllers/controllers");

const app = express.Router();

app.delete("/pets/:id", controllers.destroyPet);
app.get("/foundations/:id/pets", controllers.listPets);
app.post("/foundations/:foundationId/pets", controllers.createPet);
app.get("/pets/:petId/manage", controllers.listRequests);
app.put("/pets/:petId/manage/:requestId", controllers.createPet);

module.exports = app;
