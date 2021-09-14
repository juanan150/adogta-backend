const express = require("express");

const controllers = require("../controllers/controllers");

const app = express.Router();

app.delete("/pets/:id", controllers.destroyPet);
app.get("/foundations/:id/pets", controllers.listPets);
app.post("/foundations/:foundationId/pets", controllers.createPet);
app.get("/pets/:petId", controllers.getPet);
app.get("/pets/:petId/requests", controllers.listRequests);
app.put("/pets/:petId/requests/:requestId", controllers.updateRequest);

module.exports = app;
