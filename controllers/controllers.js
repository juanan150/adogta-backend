const User = require("../models/User");
const Foundation = require("../models/Foundation");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const Pet = require("../models/Pet");
const AdoptionRequest = require("../models/AdoptionRequest");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "dhqas6oro",
  api_key: "534792226896236",
  api_secret: "xvE1je_5sLOG-b4bs_E96hj1BG4",
});

const createUser = async (req, res, next) => {
  try {
    let newUser;
    if (req.body.role === "user" || req.body.role === "admin") {
      newUser = await new User(req.body);
    } else {
      newUser = await new Foundation(req.body);
    }
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
};

const createRequest = async (req, res, next) => {
  try {
    const { _id } = res.locals.user;

    const sameAdoptions = await AdoptionRequest.find({
      userId: _id,
      petId: req.body.petId,
    });

    if (sameAdoptions.length >= 1) {
      return res
        .status(422)
        .json({ error: "You have already sent a request to adopt this pet" });
    } else {
      const request = await AdoptionRequest.create({
        userId: _id,
        petId: req.body.petId,
        description: req.body.description,
      });

      await User.updateOne(
        { _id: _id },
        {
          phoneNumber: req.body.phoneNumber,
          address: req.body.address,
        }
      );
      res.status(200).json({ request });
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
  const imagesFiles = req.files;
  const { name, age, description } = req.body;
  // console.log("Files:", imagesFiles);

  const data = {
    name,
    description,
    age,
  };

  try {
    cloudinary.uploader.upload(
      imagesFiles.photoUrl.file,
      async function (error, result) {
        if (error) {
          return next(error);
        }
        fs.rm(`uploads/${imagesFiles.uuid}`, { recursive: true }, err => {
          if (err) {
            return next(error);
          }
        });

        const dataPet = {
          ...data,
          photoUrl: result.url,
          foundationId: req.params.foundationId,
        };
        const pet = new Pet(dataPet);
        console.log(pet);
        await pet.save();
        res.status(201).json(pet);
      }
    );
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "*Please fill in all the fields of the form" });
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
    res.status(401).json({ error: "User not found" });
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
      request => request.petId.foundationId.toString() === req.params.id
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
  createUser,
  login,
  loadUser,
  updateProfile,
  deleteFoundation,
  listUsers,
  deleteUsers,
  bulkReject,
  createRequest,
};
