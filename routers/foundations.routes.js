const express = require("express");
const login = require("../controllers/foundationController");

const router = express.Router();

router.post("/login", login);

module.exports = router;
