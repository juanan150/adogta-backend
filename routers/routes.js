const express = require("express");
const controllers = require("../controllers/controllers");
const { auth } = require("../middlewares/middlewares");
const app = express.Router();

app.get("/me", auth, controllers.loadUser);
app.post("/login", controllers.login);
app.delete("/pets/:petId", auth, controllers.destroyPet);
app.get("/foundations/:foundationId/pets", auth, controllers.listPets);
app.post("/foundations/:foundationId/pets", auth, controllers.createPet);
app.post("/signup", controllers.createUser);
app.get(
  "/foundations/:foundationId/requests",
  auth,
  controllers.listFoundationRequests
);
app.get("/pets/:petId", auth, controllers.getPet);
app.get("/pets/:petId/requests", auth, controllers.listRequests);
app.put("/pets/:petId/requests/:requestId", auth, controllers.updateRequest);
app.post("/pets/:petId/request", auth, controllers.createRequest);

module.exports = app;
