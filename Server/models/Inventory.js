const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    item: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    quantity: {
      type: String,
      required: true,
    },

    expiry: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Good", "Expiring Soon", "Critical"],
      default: "Good",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Inventory", inventorySchema);
