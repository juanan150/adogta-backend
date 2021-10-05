const mongoose = require("mongoose");

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
  {
    timestamps: true,
  }
);

const AdoptionRequest = mongoose.model(
  "adoptionrequests",
  adoptionRequestSchema
);

module.exports = AdoptionRequest;
