const express = require("express");
const controllers = require("../controllers/controllers");
const { auth, authAdmin } = require("../middlewares/middlewares");
const app = express.Router();

app.get("/me", auth, controllers.loadUser);
app.post("/login", controllers.login);
app.put("/:id/profile", auth, controllers.updateProfile);
app.delete("/pets/:petId", auth, controllers.destroyPet);
app.get("/foundations", controllers.listFoundations);
app.get("/foundations/:foundationId/pets", auth, controllers.listPets);
app.get("/foundations/:id/requests", controllers.listFoundationRequests);
app.post("/foundations/:foundationId/pets", controllers.createPet);
app.get("/pets/:petId", auth, controllers.getPet);
app.get("/pets/:petId/requests", auth, controllers.listRequests);
app.put("/pets/:petId/requests/", auth, controllers.bulkReject);
app.put("/pets/:petId/requests/:requestId", auth, controllers.updateRequest);
app.get("/admin", controllers.listFoundations);
app.delete("/admin", controllers.deleteFoundation);
app.get("/admin/users", controllers.listUsers);
app.delete("/admin/users", controllers.deleteUsers);
app.post("/signup", controllers.createUser);
app.post("/pets/:petId/request", auth, controllers.createRequest);
app.get("/adminSearch", controllers.adminSearch);

module.exports = app;
