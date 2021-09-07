Pet = require("../models/Pet");
mongoose = require("mongoose");

const destroy = async (req, res, next) => {
  //testing delete option
  try {
    await Pet.deleteOne({ _id: req.params.id });
    res.status(204).end();
  } catch (e) {
    next(e);
  } finally {
    mongoose.disconnect();
  }
};

module.exports = {
  destroy,
};
