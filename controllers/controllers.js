Foundation = require("../models/Foundation");
mongoose = require("mongoose");

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

module.exports = {
  listFoundations,
};
