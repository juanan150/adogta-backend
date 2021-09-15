const Pet = require("../models/Pet");
const User = require("../models/User");
const Foundation = require("../models/Foundation");

const createUser = async (req, res, next) => {
  try {
    let newUser;
    console.log(req.body);
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
};
