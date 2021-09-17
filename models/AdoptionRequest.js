const mongoose = require("mongoose")

const adoptionRequestSchema = mongoose.Schema({
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
})

const AdoptionRequest = mongoose.model("AdoptionRequest", adoptionRequestSchema)

module.exports = AdoptionRequest
