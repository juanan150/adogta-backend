const express = require("express");
const controllers = require("../controllers/controllers");
const { auth, authAdmin } = require("../middlewares/middlewares");
const app = express.Router();

app.get("/me", auth, controllers.loadUser);
app.post("/login", controllers.login);
<<<<<<< HEAD
app.delete("/pets/:petId", auth, controllers.destroyPet);
app.get("/foundations/:foundationId/pets", auth, controllers.listPets);
app.post("/foundations/:foundationId/pets", auth, controllers.createPet);
app.get(
  "/foundations/:foundationId/requests",
  auth,
  controllers.listFoundationRequests
);
app.get("/pets/:petId", auth, controllers.getPet);
app.get("/pets/:petId/requests", auth, controllers.listRequests);
app.put("/pets/:petId/requests/:requestId", auth, controllers.updateRequest);
=======
app.delete("/pets/:id", auth, controllers.destroyPet);
app.get("/foundations", auth, controllers.listFoundations);
app.get("/foundations/:id/pets", auth, controllers.listPets);
app.get("/foundations/:id/requests", controllers.listFoundationRequests);
app.post("/foundations/:foundationId/pets", controllers.createPet);
app.get("/pets/:petId", controllers.getPet);
app.get("/pets/:petId/requests", controllers.listRequests);
app.put("/pets/:petId/requests/:requestId", controllers.updateRequest);
app.get("/admin", authAdmin, controllers.listFoundations);
app.delete("/admin", authAdmin, controllers.deleteFoundation);
app.get("/admin/users", authAdmin, controllers.listUsers);
app.delete("/admin/users", authAdmin, controllers.deleteUsers);
>>>>>>> 2579e16411cf2ebbd7514a6c480536e19d7b121f

module.exports = app;
