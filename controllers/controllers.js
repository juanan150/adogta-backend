const User = require("../models/User");
const Foundation = require("../models/Foundation");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const Pet = require("../models/Pet");
const AdoptionRequest = require("../models/AdoptionRequest");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const crypto = require("crypto");
const sendEmailRequest = require("../utils/sendEmailRequest");
require("dotenv").config();

const templateApproved = config.templateApproved;
const templateRejected = config.templateRejected;
const sendMail = require("../utils/sendMail");

const createUser = async (req, res, next) => {
  const { email, role } = req.body;
  try {
    const schema = {
      user: User,
      admin: User,
      foundation: Foundation,
    };

    const newUser = await new schema[role](req.body);

    const hash = crypto
      .createHash("sha256")
      .update(newUser.email)
      .digest("hex");
    newUser.passwordResetToken = hash;

    const user = await newUser.save();

    const token = jwt.sign({ userId: user._id }, config.jwtKey);

    await sendMail({
      to: email,
      template_id: config.senGridTemplateEmailVerification,
      dynamic_template_data: {
        name: newUser.name,
        url: `${config.adogtaPublicUrl}/verified/${hash}`,
      },
    });

    res.status(201).json({ token });
  } catch (err) {
    if (err.name === "ValidationError") {
      console.log(err);
      res.status(422).json({ error: "Email is already taken" });
    } else {
      next(err);
    }
  }
};

const verifiedEmail = async (req, res) => {
  const { token } = req.params;

  const filter = { passwordResetToken: token };
  const update = {
    passwordResetToken: null,
    active: true,
  };

  try {
    let user = await User.findOneAndUpdate(filter, update);

    let token;

    if (user) {
      token = jwt.sign({ userId: user._id }, config.jwtKey);
    } else {
      user = await Foundation.findOneAndUpdate(filter, update);
      token = jwt.sign({ userId: user._id }, config.jwtKey);
    }

    if (!user) {
      return res.status(404).end();
    }

    return res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).send(error);
  }
};

const createRequest = async (req, res, next) => {
  try {
    const { _id, email, name } = res.locals.user;

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

      await sendMail({
        to: email,
        template_id: config.senGridTemplateId,
        dynamic_template_data: {
          name: name,
        },
      });

      res.status(200).json({ request });
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(422).json(err.errors);
    } else {
      next(err);
    }
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.authenticate(email, password);
    if (user) {
      const token = jwt.sign({ userId: user._id }, config.jwtKey);
      const { _id, name, email, role, address, phoneNumber, photoUrl } = user;
      res.json({
        token,
        _id,
        name,
        email,
        role,
        address,
        phoneNumber,
        photoUrl,
      });
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const listFoundationsAdmin = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const foundations = await Foundation.find(
      {},
      { password: 0, __v: 0, role: 0 },
      {
        skip: (page - 1) * 5,
        limit: 5,
      }
    )
      .collation({ locale: "en" })
      .sort({ name: 1 });
    res.status(200).json(foundations);
  } catch (e) {
    return next(e);
  }
};

const listFoundations = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const foundations = await Foundation.find(
      {},
      { password: 0, __v: 0, role: 0 },
      {
        skip: (page - 1) * 10,
        limit: 10,
      }
    )
      .collation({ locale: "en" })
      .sort({ name: 1 });
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
    )
      .collation({ locale: "en" })
      .sort({ name: 1 });
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
    ).sort({ createdAt: -1 });
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
  let imagesFiles = req.files;
  const { name, age, description } = req.body;

  const data = {
    name,
    description,
    age,
    foundationId: req.params.foundationId,
  };

  try {
    let arrayOfImagesFiles = {
      photoUrl: [],
    };
    if (!imagesFiles.photoUrl.length) {
      arrayOfImagesFiles.photoUrl.push(imagesFiles.photoUrl);
    } else {
      arrayOfImagesFiles = {
        ...imagesFiles,
      };
    }

    let petPhotos = [];
    for (let i = 0; i < arrayOfImagesFiles.photoUrl.length; i++) {
      cloudinary.uploader.upload(
        arrayOfImagesFiles.photoUrl[i].file,
        async function (error, result) {
          if (error) {
            return next(error);
          }
          petPhotos.push(result.url);
          dataPet = {
            ...data,
            photoUrl: [...petPhotos],
          };
          if (dataPet.photoUrl.length === arrayOfImagesFiles.photoUrl.length) {
            const pet = new Pet(dataPet);
            await pet.save();
            res.status(201).json(pet);
          }
          fs.rm(
            `uploads/${arrayOfImagesFiles.photoUrl[i].uuid}`,
            { recursive: true },
            err => {
              if (err) {
                return next(error);
              }
            }
          );
        }
      );
    }
  } catch (error) {
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
    _id,
    role,
  };
  const imageFile = req.files.image;
  const schemas = { user: User, foundation: Foundation };
  try {
    if (imageFile) {
      cloudinary.uploader.upload(
        imageFile.file,
        async function (error, result) {
          if (error) {
            return next(error);
          }
          fs.rm(`uploads/${imageFile.uuid}`, { recursive: true }, err => {
            if (err) {
              return next(error);
            }
          });

          await schemas[role].findByIdAndUpdate(_id, {
            ...data,
            photoUrl: result.url,
          });
          res.status(200).json({
            name,
            email,
            address,
            phoneNumber,
            role,
            photoUrl: result.url,
            _id,
          });
          return;
        }
      );
    } else {
      await schemas[role].findByIdAndUpdate(_id, data);
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
    if (req.params.petId.length === 24) {
      const pet = await Pet.findOne({ _id: req.params.petId });
      if (pet) {
        res.status(200).json(pet);
      } else {
        res.status(404).json({ error: "Pet not found" });
      }
    } else {
      res.status(400).json({ error: "Invalid Pet id" });
    }
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
    )
      .populate("userId")
      .populate("petId");
    if (req.body.responseStatus === "approved") {
      const pet = await Pet.findOneAndUpdate(
        {
          _id: request.petId,
        },
        {
          adopted: true,
        }
      );
      let varPhoto = "";
      if (pet.photoUrl) varPhoto = pet.photoUrl[0];
      sendEmailRequest({
        template_id: templateApproved,
        dynamic_template_data: {
          name: pet.name,
          photoUrl: varPhoto,
        },
        to: request["userId"].email,
      });
    } else {
      let varPhoto = "";
      if (request["petId"].photoUrl) varPhoto = request["petId"].photoUrl[0];
      sendEmailRequest({
        template_id: templateRejected,
        dynamic_template_data: {
          name: request["petId"].name,
          photoUrl: varPhoto,
        },
        to: request["userId"].email,
      });
    }
    let { _id, userId, petId, description, responseStatus, updatedAt } =
      request;
    petId = request["petId"]._id;
    userId = request["userId"]._id;
    res
      .status(200)
      .json({ _id, userId, petId, description, responseStatus, updatedAt });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const bulkReject = async (req, res, next) => {
  try {
    await AdoptionRequest.updateMany(
      {
        petId: req.params.petId,
        _id: { $ne: req.body._id },
      },
      {
        responseStatus: "rejected",
      },
      { new: true }
    );

    // There is no method to update multiple documents and return all updated documents in mongoose.
    const request = await AdoptionRequest.find({
      petId: req.params.petId,
      _id: { $ne: req.body._id },
    })
      .populate("userId")
      .populate("petId");

    for (const adoption of request) {
      const userMail = adoption["userId"].email;
      let varPhoto = "";
      if (adoption["petId"].photoUrl) varPhoto = adoption["petId"].photoUrl[0];
      sendEmailRequest({
        template_id: templateRejected,
        dynamic_template_data: {
          name: adoption["petId"].name,
          photoUrl: varPhoto,
        },
        to: userMail,
      });
    }
    res.status(204).end();
  } catch (e) {
    console.error(e);
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

const listUserRequests = async (req, res, next) => {
  try {
    response = await AdoptionRequest.find({
      userId: req.params.userId,
    }).populate({
      path: "petId",
      model: Pet,
    });
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};
const adminSearch = async (req, res, next) => {
  try {
    let toSearch = {};
    toSearch[req.body.field] = req.body.value;
    const page = req.query.page || 1;

    // _id needs to have length 24 to be valid
    if (req.body.field === "_id" && req.body.value.length !== 24) {
      res.status(200).json([]);
      return;
    }

    if (req.body.isUser) {
      let users = await User.find(
        toSearch,
        { password: 0, __v: 0, role: 0 },
        { skip: (page - 1) * 5, limit: 5 }
      );
      res.status(200).json(users);
    } else {
      let foundation = await Foundation.find(
        toSearch,
        { password: 0, __v: 0, role: 0 },
        { skip: (page - 1) * 5, limit: 5 }
      );
      res.status(200).json(foundation);
    }
  } catch (e) {
    console.error(e);
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
  listUserRequests,
  adminSearch,
  verifiedEmail,
  listFoundationsAdmin,
};
