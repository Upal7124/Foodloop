const express = require("express");
const KitchenProfile = require("../models/KitchenProfile");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const profile = await KitchenProfile.findOneAndUpdate(
      { user: req.user.userId },
      {
        user: req.user.userId,
        ...req.body,
      },
      {
        new: true,
        upsert: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Kitchen profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to save kitchen profile",
    });
  }
});

module.exports = router;
