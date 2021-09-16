const express = require("express");
const controllers = require("../controllers/controllers");
const { auth } = require("../middlewares/middlewares");
const app = express.Router();

app.get("/me", auth, controllers.loadUser);
app.post("/login", controllers.login);
app.get("/:id/profile", auth);
app.put("/:id/profile", auth, controllers.updateProfile);
app.delete("/pets/:id", auth, controllers.destroyPet);
app.get("/foundations/:id/pets", auth, controllers.listPets);
app.post("/foundations/:foundationId/pets", auth, controllers.createPet);

module.exports = app;
