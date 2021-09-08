Pet = require("../models/Pet");
mongoose = require("mongoose");

const listPets = async (req, res, next) => {
  try {
    const pets = await Pet.find({ foundation_id: req.params.id });
    res.status(200).json(pets);
  } catch (e) {
    return next(e);
  }
};

const destroyPet = async (req, res, next) => {
  try {
    await Pet.deleteOne({ _id: req.params.id });
    res.status(204).end();
  } catch (e) {
    return next(e);
  }
};

const createPet = async (req, res, next) => {
  try {
    data = {
      name: req.body.name,
      description: req.body.description,
      photo_url: req.body.photo_url,
      age: req.body.age,
      foundation_id: req.params.foundationId,
    };
    const pet = new Pet(data);
    await pet.save();
    res.status(201).json(pet);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  destroyPet,
  listPets,
  createPet,
};
