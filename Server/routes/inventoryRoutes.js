const express = require("express");
const Inventory = require("../models/Inventory");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get logged-in user's inventory
router.get("/", protect, async (req, res) => {
  try {
    const items = await Inventory.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory",
    });
  }
});

// Add inventory item
router.post("/", protect, async (req, res) => {
  try {
    const { item, category, quantity, expiry, status } = req.body;

    const newItem = await Inventory.create({
      user: req.user.userId,
      item,
      category,
      quantity,
      expiry,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Inventory item added",
      item: newItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add inventory item",
    });
  }
});

module.exports = router;
