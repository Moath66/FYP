const express = require("express");
const router = express.Router();
const {
  submitMaintenance,
  getByResident,
  getAllMaintenance,
  updateMaintenanceStatus,
} = require("../controllers/maintenanceController");
const verifyToken = require("../middleware/authMiddleware");

// 🔹 POST: Resident submits maintenance request
router.post("/submit", verifyToken, submitMaintenance);

// 🔹 GET: Fetch maintenance requests by resident ID
router.get("/resident/:id", verifyToken, getByResident);

// 🔹 GET: Staff gets all maintenance requests
router.get("/all", verifyToken, getAllMaintenance);

// 🔹 PATCH: Staff updates status and action
router.patch("/update/:id", verifyToken, updateMaintenanceStatus);

module.exports = router;
