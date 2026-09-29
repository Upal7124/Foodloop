const express = require("express");
const SurplusSession = require("../models/SurplusSession");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get today's surplus session
router.get("/today", protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const session = await SurplusSession.findOne({
      user: req.user.userId,
      date: today,
    });

    res.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch surplus session",
    });
  }
});

// Save/update today's surplus session
router.post("/", protect, async (req, res) => {
  try {
    const { date, morning, evening } = req.body;

    const session = await SurplusSession.findOneAndUpdate(
      {
        user: req.user.userId,
        date,
      },
      {
        user: req.user.userId,
        date,
        morning,
        evening,
      },
      {
        new: true,
        upsert: true,
      },
    );

    res.json({
      success: true,
      message: "Surplus session saved",
      session,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to save surplus session",
    });
  }
});

module.exports = router;
