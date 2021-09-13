const express = require("express");
const app = express.Router();
const { auth } = require("../middlewares/middelwares");
const { createUser, getUser, login } = require("../controllers/controllers");

app.post("/signup", createUser);
app.get("/", auth, getUser); // It's optional, must change the url to users id
app.post("/login", login);
module.exports = app;
