const mongoose = require("mongoose");

const surplusListingSchema = new mongoose.Schema(
  {
    kitchen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    kitchenName: String,
    city: String,
    address: String,

    items: [
      {
        name: String,
        category: String,
        morningPrepared: Number,
        eveningRemaining: Number,
        surplus: Number,
      },
    ],

    totalSurplus: {
      type: Number,
      required: true,
    },

    pickupBy: String,
    notes: String,

    mlGenerated: {
      type: Boolean,
      default: false,
    },

    modelVersion: String,

    status: {
      type: String,
      enum: ["available", "claimed", "completed"],
      default: "available",
    },

    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SurplusListing", surplusListingSchema);
