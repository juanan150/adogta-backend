const User = require("../models/User");
const Foundation = require("../models/Foundation");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const Pet = require("../models/Pet");
const AdoptionRequest = require("../models/AdoptionRequest");

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

const createRequest = async (req, res, next) => {
  try {
    // const user = await User.findById(req.body.userId);
    const pet = await Pet.findById(req.body.petId);
    const { _id } = res.locals.user;
    console.log(_id.toString());

    const sameAdoptions = await AdoptionRequest.find({
      userId: _id,
      petId: req.body.petId,
    });

    if (sameAdoptions.length >= 1) {
      return res
        .status(422)
        .json({ err: "You have already sent a request to adopt this pet" });
    } else {
      const request = await AdoptionRequest.create({
        userId: _id,
        petId: req.body.petId,
        description: req.body.description,
      });

      await User.updateOne(
        { _id: req.body.userId },
        {
          phoneNumber: req.body.phoneNumber,
          address: req.body.address,
        }
      );
      res.status(200).json({ request, user, pet });
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

const listFoundations = async (req, res, next) => {
  try {
    const foundations = await Foundation.find(
      {},
      { password: 0, __v: 0, role: 0 }
    ).limit(10);
    res.status(200).json(foundations);
  } catch (e) {
    return next(e);
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

module.exports = {
  listFoundations,
  destroyPet,
  listPets,
  createPet,
  listRequests,
  updateRequest,
  getPet,
  listFoundationRequests,
  createUser,
  login,
  loadUser,
  createRequest,
};
