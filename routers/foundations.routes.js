const express = require("express");

const { auth } = require("../middlewares/middlewares");
const User = require("../api/models/User");

const router = express.Router();

router.post("/login", login);

router.get("/foundations", auth, (req, res) => {
  res.status(200).json({ response: res });
});

module.exports = router;
