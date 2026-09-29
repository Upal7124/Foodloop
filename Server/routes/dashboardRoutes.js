const express = require("express");
const protect = require("../middleware/authMiddleware");
const Inventory = require("../models/Inventory");
const SurplusListing = require("../models/SurplusListing");
const SurplusSession = require("../models/SurplusSession");

const router = express.Router();

router.get("/stats", protect, async (req, res) => {
  try {
    const inventoryCount = await Inventory.countDocuments({
      user: req.user.userId,
    });

    const surplusListings = await SurplusListing.find({
      kitchen: req.user.userId,
    });

    const foodWaste = surplusListings.reduce(
      (total, listing) => total + (Number(listing.totalSurplus) || 0),
      0,
    );

    const foodRedistributed = surplusListings
      .filter(
        (listing) =>
          listing.status === "claimed" || listing.status === "completed",
      )
      .reduce(
        (total, listing) => total + (Number(listing.totalSurplus) || 0),
        0,
      );
    const wasteByCategory = {};

    surplusListings.forEach((listing) => {
      listing.items.forEach((item) => {
        const category = item.category || "Other";
        const surplus = Number(item.surplus) || 0;

        wasteByCategory[category] = (wasteByCategory[category] || 0) + surplus;
      });
    });

    const wasteComposition = Object.entries(wasteByCategory).map(
      ([name, value]) => ({
        name,
        value,
      }),
    );
    const sessions = await SurplusSession.find({
      user: req.user.userId,
    });

    let foodPrepared = 0;

    sessions.forEach((session) => {
      const morningItems = session.morning?.items || [];

      morningItems.forEach((item) => {
        foodPrepared += Number(item.weight || 0);
      });
    });
    const consumption = sessions.slice(-7).map((session) => ({
      day: new Date(session.date).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      actual: (session.morning?.items || []).reduce(
        (total, item) => total + Number(item.weight || 0),
        0,
      ),
      predicted: 0,
    }));
    res.json({
      success: true,
      stats: {
        mealsPrepared: foodPrepared,
        mealsServed: 0,
        foodWaste,
        foodRedistributed,
        inventoryItems: inventoryCount,
        consumption,
        wasteComposition,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
});

module.exports = router;
