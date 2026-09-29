const mongoose = require("mongoose");

const surplusItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    mlSuggested: {
      type: Number,
      default: null,
    },

    mlUnit: {
      type: String,
      default: "kg",
    },
  },
  { _id: false },
);

const surplusSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    morning: {
      items: {
        type: [surplusItemSchema],
        default: [],
      },
      locked: {
        type: Boolean,
        default: false,
      },
    },

    evening: {
      items: {
        type: [surplusItemSchema],
        default: [],
      },
      locked: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true },
);

surplusSessionSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("SurplusSession", surplusSessionSchema);
