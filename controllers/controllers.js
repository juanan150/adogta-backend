const User = require("../models/User");
const Foundation = require("../models/Foundation");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const Pet = require("../models/Pet");

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
  const { name, email, address, phoneNumber, role, photoUrl, _id } =
    res.locals.user;
  res.json({ name, email, address, phoneNumber, role, photoUrl, _id });
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

const updateProfile = async (req, res, next) => {
  const { name, address, email, phoneNumber, photoUrl, _id, role } = req.body;

  data = {
    name,
    address,
    phoneNumber,
    email,
    photoUrl,
    _id,
    role,
  };

  try {
    if (role === "user") {
      const user = await User.findByIdAndUpdate(_id, data, {
        new: true,
      });
      res
        .status(200)
        .json({ name, email, address, phoneNumber, role, photoUrl, _id });
      return;
    } else {
      const foundation = await Foundation.findByIdAndUpdate(_id, data, {
        new: true,
      });
      res
        .status(200)
        .json({ name, email, address, phoneNumber, role, photoUrl, _id });
      return;
    }
  } catch (error) {
    res.status(401).json({ error: "User not foundss" });
  }
};

module.exports = {
  destroyPet,
  listPets,
  createPet,
  login,
  loadUser,
  updateProfile,
};
