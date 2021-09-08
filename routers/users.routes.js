const express = require("express");

const login = require("../controllers/userController");
const { auth } = require("../middlewares/middlewares");
const User = require("../api/models/User");

const router = express.Router();

router.post("/login", login);

module.exports = router;
