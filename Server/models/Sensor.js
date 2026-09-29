const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    value: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Online",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sensor", sensorSchema);