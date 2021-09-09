const User = require("../models/User");
const Foundation = require("../models/Foundation");

const createUser = async (req, res, next) => {
  if (req.body.role === "user") {
    try {
      const newUser = await new User(req.body);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (err) {
      if (err.name === "ValidationError") {
        console.log("Error de validación:", err.errors);
        res.status(422).json(err.message);
      } else {
        next(err);
        console.log(err);
      }
    }
  } else {
    try {
      const newFoundation = await new Foundation(req.body);
      await newFoundation.save();
      res.status(201).json(newFoundation);
    } catch (err) {
      if (err.name === "ValidationError") {
        console.log("Error de validación:", err.errors);
        res.status(422).json(err.message);
      } else {
        next(err);
        console.log(err);
      }
    }
  }
};

module.exports = createUser;
