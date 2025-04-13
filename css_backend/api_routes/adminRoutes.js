const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");

// ✅ Secure Admin Route (only accessible with valid token and role)
router.get("/dashboard", authMiddleware, adminController.getDashboard);

module.exports = router;
