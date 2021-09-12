const User = require("../models/User");
const Foundation = require("../models/Foundation");

const createUser = async (req, res, next) => {
  console.log(req.body.role);
  if (req.body.role === "user") {
    try {
      const newUser = await new User(req.body);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (err) {
      if (err.name === "ValidationError") {
        console.log("Validation Error:", err.errors);
        res.status(422).json(err.errors);
      } else {
        next(err);
        console.log(err);
      }
    }
  } else if (req.body.role === "foundation") {
    console.log(req.body.role);
    try {
      const newFoundation = await new Foundation(req.body);
      await newFoundation.save();
      res.status(201).json(newFoundation);
    } catch (err) {
      if (err.name === "ValidationError") {
        console.log("Validation Error:", err.errors);
        res.status(422).json(err.errors);
        console.log(err);
      } else {
        next(err);
        console.log(err);
      }
    }
  }
};

const getUser = async (req, res, next) => {
  console.log(req.body.email);
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    res.status(201).json(user);
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

module.exports = { createUser, getUser };
