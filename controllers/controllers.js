const User = require("../models/User");
const Foundation = require("../models/Foundation");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const Pet = require("../models/Pet");
const AdoptionRequest = require("../models/AdoptionRequest");

const login = async (req, res) => {
  const { email, password } = req.body;

  let user = await User.authenticate(email, password);

  if (user) {
    const token = jwt.sign({ userId: user._id }, config.jwtKey);
    const { _id, name, email, role } = user;
    res.json({ token, _id, name, email, role });
  } else {
    user = await Foundation.authenticate(email, password);
    if (user) {
      const token = jwt.sign({ userId: user._id }, config.jwtKey);
      const { _id, name, email, role } = user;
      res.json({ token, _id, email, name, role });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  }
};

const listFoundations = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const foundations = await Foundation.find(
      {},
      { password: 0, __v: 0, role: 0 },
      { skip: (page - 1) * 5, limit: 5 }
    );
    res.status(200).json(foundations);
  } catch (e) {
    return next(e);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const users = await User.find(
      {},
      { password: 0, __v: 0, role: 0 },
      { skip: (page - 1) * 5, limit: 5 }
    );
    res.status(200).json(users);
  } catch (e) {
    return next(e);
  }
};

const loadUser = async (req, res) => {
  const { _id, name, email, address, phoneNumber, role, photoUrl } =
    res.locals.user;
  res.json({ _id, name, email, address, phoneNumber, role, photoUrl });
};

const listPets = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const count = await Pet.count({ foundationId: req.params.foundationId });
    const pets = await Pet.find(
      { foundationId: req.params.foundationId },
      null,
      {
        skip: (page - 1) * 10,
        limit: 10,
      }
    );
    res.status(200).json({ page, count, pets });
  } catch (e) {
    next(e);
  }
};

const destroyPet = async (req, res, next) => {
  try {
    await Pet.deleteOne({ _id: req.params.petId });
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

const deleteFoundation = async (req, res, next) => {
  try {
    await Foundation.deleteMany(req.body);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

const listRequests = async (req, res, next) => {
  try {
    response = await AdoptionRequest.find({
      petId: req.params.petId,
    }).populate("userId");
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const updateRequest = async (req, res, next) => {
  try {
    const request = await AdoptionRequest.findOneAndUpdate(
      {
        _id: req.params.requestId,
      },
      {
        responseStatus: req.body.responseStatus,
      },
      { new: true }
    );
    res.status(200).json(request);
  } catch (e) {
    next(e);
  }
};

const bulkReject = async (req, res, next) => {
  try {
    const request = await AdoptionRequest.updateMany(
      {
        petId: req.params.petId,
        _id: { $ne: req.body._id },
      },
      {
        responseStatus: "rejected",
      },
      { new: true }
    );
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

const listFoundationRequests = async (req, res, next) => {
  try {
    response = await AdoptionRequest.find().populate({
      path: "petId",
      model: Pet,
    });
    const reqs = response.filter(
      (request) => request.petId.foundationId.toString() === req.params.id
    );
    res.status(200).json(reqs);
  } catch (e) {
    next(e);
  }
};

const deleteUsers = async (req, res, next) => {
  try {
    await User.deleteMany(req.body);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  listFoundations,
  destroyPet,
  listPets,
  createPet,
  listRequests,
  updateRequest,
  getPet,
  listFoundationRequests,
  login,
  loadUser,
  deleteFoundation,
  listUsers,
  deleteUsers,
  bulkReject,
};
