const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    letter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Letter",
      required: true,
    },
    name: String,
    street: String,
    apartment: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
