const express = require("express");
const app = express.Router();
const { auth } = require("../middlewares/middlewares");
const {
  createUser,
  getUser,
  login,
  destroyPet,
  listPets,
} = require("../controllers/controllers");

app.post("/signup", createUser);
app.get("/", auth, getUser); // It's optional, must change the url to users id
app.post("/login", login);
app.delete("/pets/:id", destroyPet);
app.get("/foundations/:id/pets", listPets);
module.exports = app;
