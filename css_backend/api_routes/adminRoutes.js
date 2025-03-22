const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Admin Dashboard Route
router.get("/dashboard", adminController.getDashboard);

module.exports = router;
