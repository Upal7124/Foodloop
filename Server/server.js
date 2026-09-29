const authRoutes = require("./routes/authRoutes");
const kitchenRoutes = require("./routes/kitchenRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const surplusRoutes = require("./routes/surplusRoute");
const surplusListingRoutes = require("./routes/surplusListingRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.use("/api/auth", authRoutes);
app.use("/api/kitchen", kitchenRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/surplus", surplusRoutes);
app.use("/api/surplus-listings", surplusListingRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "FoodLoop backend is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on https://foodloop-backend-17zr.onrender.com/`);
});
