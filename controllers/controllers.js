const Pet = require("../models/Pet");
const AdoptionRequest = require("../models/AdoptionRequest");

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

const getPet = async (req, res, next) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.petId });
    res.status(200).json(pet);
  } catch (e) {
    next(e);
  }
};

const listRequests = async (req, res, next) => {
  try {
    //const ObjectId = require("mongoose").Types.ObjectId;
    const requests = await AdoptionRequest.find({
      petId: req.params.petId,
    });
    res.status(200).json(requests);
  } catch (e) {
    next(e);
  }
};

const updateRequest = async (req, res, next) => {
  try {
    //const ObjectId = require("mongoose").Types.ObjectId;
    const requests = await AdoptionRequest.find({
      petId: req.params.petId,
    });
    res.status(200).json(requests);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  destroyPet,
  listPets,
  createPet,
  listRequests,
  updateRequest,
  getPet,
};
