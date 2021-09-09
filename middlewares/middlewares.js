const jwt = require("jsonwebtoken");
const User = require("../api/models/User");
const Foundation = require("../api/models/Foundation");

const auth = async (req, res, next) => {
  try {
    const token = req.get("Authorization");
    const data = jwt.verify(token, "secret key");

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

module.exports = { auth };
