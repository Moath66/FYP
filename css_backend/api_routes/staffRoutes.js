const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");

// Staff Dashboard Route
router.get("/dashboard", staffController.getDashboard);

module.exports = router;
