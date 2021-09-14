const express = require("express");
const controllers = require("../controllers/controllers");
const { auth } = require("../middlewares/middlewares");
const app = express.Router();

app.get("/me", auth, controllers.loadUser);
app.post("/login", controllers.login);
app.delete("/pets/:id", controllers.destroyPet);
app.get("/foundations/:id/pets", controllers.listPets);
app.post("/foundations/:foundationId/pets", controllers.createPet);

module.exports = app;
