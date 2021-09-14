Pet = require("../models/Pet");
mongoose = require("mongoose");

const destroyPet = async (req, res, next) => {
  //testing delete option
  try {
    await Pet.deleteOne({ _id: req.params.id });
    res.status(204).end();
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  destroyPet,
};
