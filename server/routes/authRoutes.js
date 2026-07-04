const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    registerUser,
    loginUser,
    getProfile
} = require("../controllers/authController");
// Register
router.post("/register", registerUser);
router.get("/profile", authMiddleware, getProfile);
// Login
router.post("/login", loginUser);

module.exports = router;
