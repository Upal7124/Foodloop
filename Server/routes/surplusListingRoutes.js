const express = require("express");
const SurplusListing = require("../models/SurplusListing");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get available surplus listings
router.get("/", protect, async (req, res) => {
  try {
    const listings = await SurplusListing.find()
      .populate("kitchen", "name email")
      .populate("claimedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      listings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch surplus listings",
    });
  }
});

// Create a surplus listing
router.post("/", protect, async (req, res) => {
  try {
    const listing = await SurplusListing.create({
      kitchen: req.user.userId,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Surplus listed successfully",
      listing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create surplus listing",
    });
  }
});
// Claim a surplus listing
router.patch("/:id/claim", protect, async (req, res) => {
  try {
    const listing = await SurplusListing.findByIdAndUpdate(
      req.params.id,
      {
        status: "claimed",
        claimedBy: req.user.userId,
      },
      {
        new: true,
      },
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Surplus listing not found",
      });
    }

    res.json({
      success: true,
      message: "Surplus claimed successfully",
      listing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to claim surplus",
    });
  }
});

module.exports = router;
