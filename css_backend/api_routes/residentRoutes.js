const express = require("express");
const router = express.Router();
const residentController = require("../controllers/residentController");

// Resident Dashboard Route
router.get("/dashboard", residentController.getDashboard);

module.exports = router;
