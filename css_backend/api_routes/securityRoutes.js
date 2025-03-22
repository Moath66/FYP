const express = require("express");
const router = express.Router();
const securityController = require("../controllers/securityController");

// Security Dashboard Route
router.get("/dashboard", securityController.getDashboard);

module.exports = router;
