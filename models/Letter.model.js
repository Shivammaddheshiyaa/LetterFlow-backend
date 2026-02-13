const mongoose = require("mongoose");

const letterSchema = new mongoose.Schema(
  {
    // 🔗 Who created this letter
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✍️ Letter content
    content: {
      type: String,
      required: true,
      trim: true,
    },

    // 📮 Recipient address (will be filled later)
    address: {
      name: String,
      street: String,
      apartment: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String,
    },

    // 📦 Letter lifecycle
    status: {
      type: String,
      enum: [
        "draft",
        "address_added",
        "pending",
        "paid",
        "printing",
        "shipped",
        "delivered",
      ],
      default: "draft",
    },



    // 💰 Payment reference (later)
    paymentId: {
      type: String,
    },

    // 🕒 Soft delete / archive
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Letter ||
  mongoose.model("Letter", letterSchema);

