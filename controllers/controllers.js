const User = require("../models/User");
const Foundation = require("../models/Foundation");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const Pet = require("../models/Pet");

const createUser = async (req, res, next) => {
  try {
    let newUser;
    console.log(req.body);
    if (req.body.role === "user" || req.body === "admin") {
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

const login = async (req, res) => {
  const { email, password } = req.body;

  let user = await User.authenticate(email, password);

  if (user) {
    const token = jwt.sign({ userId: user._id }, config.jwtKey);
    res.json({ token, user });
  } else {
    user = await Foundation.authenticate(email, password);
    if (user) {
      const token = jwt.sign({ userId: user._id }, config.jwtKey);
      res.json({ token, user });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  }
};

const loadUser = async (req, res) => {
  const { name, email, address, phoneNumber, role, photoUrl } = res.locals.user;
  res.json({ name, email, address, phoneNumber, role, photoUrl });
};

const listPets = async (req, res, next) => {
  try {
    const pets = await Pet.find({ foundationId: req.params.id });
    res.status(200).json(pets);
  } catch (e) {
    next(e);
  }
};

const destroyPet = async (req, res, next) => {
  try {
    await Pet.deleteOne({ _id: req.params.id });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

const createPet = async (req, res, next) => {
  try {
    data = {
      name: req.body.name,
      description: req.body.description,
      photoUrl: req.body.photoUrl,
      age: req.body.age,
      foundationId: req.params.foundationId,
    };
    const pet = new Pet(data);
    await pet.save();
    res.status(201).json(pet);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  destroyPet,
  listPets,
  createPet,
  createUser,
  login,
  loadUser,
};
