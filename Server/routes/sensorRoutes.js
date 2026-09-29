const express = require("express");
const Sensor = require("../models/Sensor");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get logged-in user's sensors
router.get("/", protect, async (req, res) => {
  try {
    const sensors = await Sensor.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      sensors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sensors",
    });
  }
});

// Add a sensor
router.post("/", protect, async (req, res) => {
  try {
    const { name, value, status } = req.body;

    const sensor = await Sensor.create({
      user: req.user.userId,
      name,
      value,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Sensor added successfully",
      sensor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add sensor",
    });
  }
});

module.exports = router;