const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
// Default Route
app.get("/", (req, res) => {
    res.send("Welcome to MediBridge API 🚀");
});

module.exports = app;