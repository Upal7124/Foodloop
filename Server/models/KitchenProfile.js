const mongoose = require("mongoose");

const kitchenProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    kitchenName: String,
    kitchenType: String,
    mealsPerDay: String,
    cuisineTypes: [String],

    address: String,
    city: String,
    state: String,
    pinCode: String,
    contactPhone: String,

    operatingFrom: String,
    operatingTo: String,
    operatingDays: [String],

    staffCount: Number,

    hasWasteMgmt: Boolean,
    hasRefrigeration: Boolean,
    hasWeighingScale: Boolean,

    additionalNotes: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("KitchenProfile", kitchenProfileSchema);
