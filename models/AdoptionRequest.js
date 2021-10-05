const mongoose = require("mongoose");
const opts = {
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
};

const adoptionRequestSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    responseStatus: {
      default: "pending",
      type: String,
    },
  },
  opts
);

const AdoptionRequest = mongoose.model(
  "adoptionrequests",
  adoptionRequestSchema
);

module.exports = AdoptionRequest;
