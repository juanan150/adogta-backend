const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    epaycoCustomerId: {
      type: String,
      required: true,
    },
    ref_payco: {
      type: String,
      unique: true,
      required: true,
    },
    factura: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
    },
    valor: {
      type: Number,
      required: true,
    },
    iva: {
      type: Number,
    },
    valorneto: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
