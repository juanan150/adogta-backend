const mongoose = require("mongoose");

const petSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  photoUrl: {
    type: Array,
    required: [true, "An image is required"],
    validate: {
      validator: async function (value) {
        return value.length > 0;
      },
    },
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
  },
  foundationId: {
    type: mongoose.Schema.Types.ObjectId,
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
