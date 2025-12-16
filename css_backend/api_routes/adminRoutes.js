const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");

// ✅ Secure Admin Route (only accessible with valid token and role)
router.get("/dashboard", authMiddleware, (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
}, adminController.getDashboard);

module.exports = router;
