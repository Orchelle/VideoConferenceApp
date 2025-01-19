const express = require("express");
const { register, login, getProfile } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/profile", authenticate, getProfile);

module.exports = router;
