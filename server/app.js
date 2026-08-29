const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const medicineRoutes = require("./routes/medicineRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/medicines", medicineRoutes);
// Default Route
app.get("/", (req, res) => {
    res.send("Welcome to MediBridge API 🚀");
});

module.exports = app;