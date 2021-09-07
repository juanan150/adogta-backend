const mongoose = require("mongoose");

const petSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  foundationId: {
    type: String,
    required: true,
  },
  adopted: {
    type: Boolean,
    required: true,
  },
});

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
