const express = require("express");
const controllers = require("../controllers/controllers");
const { auth } = require("../middlewares/middlewares");
const app = express.Router();

app.get("/me", auth, controllers.loadUser);
app.post("/login", controllers.login);
app.delete("/pets/:id", auth, controllers.destroyPet);
app.get("/foundations", controllers.listFoundations);
app.get("/foundations/:id/pets", auth, controllers.listPets);
app.get("/foundations/:id/requests", controllers.listFoundationRequests);
app.post("/foundations/:foundationId/pets", controllers.createPet);
app.get("/pets/:petId", controllers.getPet);
app.get("/pets/:petId/requests", controllers.listRequests);
app.put("/pets/:petId/requests/:requestId", controllers.updateRequest);

module.exports = app;
