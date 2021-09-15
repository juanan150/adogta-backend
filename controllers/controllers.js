const User = require("../models/User");
const Foundation = require("../models/Foundation");

const createUser = async (req, res, next) => {
  try {
    let newUser;
    if (req.body.role === "user") {
      newUser = await new User(req.body);
      await newUser.save();
      res.status(201).json(newUser);
    } else if (req.body.role === "foundation") {
      newUser = await new Foundation(req.body);
      await newUser.save();
      res.status(201).json(newUser);
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      console.log("Validation Error:", err.errors);
      res.status(422).json(err.errors);
    } else {
      next(err);
      console.log(err);
    }
  }
};

module.exports = { createUser };
