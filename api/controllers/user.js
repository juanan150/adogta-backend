const User = require("../models/User");

const createUser = async (req, res, next) => {
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
};

module.exports = createUser;
