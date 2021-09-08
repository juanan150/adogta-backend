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
  photo_url: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  foundation_id: {
    //type: mongoose.Schema.Types.ObjectId,
    type: Number,
    ref: "Foundation",
    required: true,
  },
  adopted: {
    type: Boolean,
    default: false,
  },
});

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
