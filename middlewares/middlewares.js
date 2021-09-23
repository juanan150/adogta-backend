const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Foundation = require("../models/Foundation");
const config = require("../config/index");

const authAdmin = async (req, res, next) => {
  try {
    const token = req.get("Authorization");
    const data = jwt.verify(token, config.jwtKey);

    let user = await User.findOne({ _id: data.userId });
    if (user && user.role === "admin") {
      res.locals.user = user;
      next();
    } else {
      res.status(401).json({ error: "User not found" });
      return;
    }
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      res.status(401).json({ error: "Invalid Token" });
      return;
    }
    next(err);
  }
};

const auth = async (req, res, next) => {
  try {
    const token = req.get("Authorization");
    const data = jwt.verify(token, config.jwtKey);

    let user = await User.findOne({ _id: data.userId });

    if (user) {
      res.locals.user = user;
      next();
    } else {
      user = await Foundation.findOne({ _id: data.userId });
      if (user) {
        res.locals.user = user;
        next();
      } else {
        res.status(401).json({ error: "User not found" });
        return;
      }
    }
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      res.status(401).json({ error: "Invalid Token" });
      return;
    }
    next(err);
  }
};

module.exports = { auth, authAdmin };
