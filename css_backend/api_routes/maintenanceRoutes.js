const express = require("express");
const router = express.Router();
const maintenanceController = require("../controllers/maintenanceController");

// Routes for maintenance requests
router.get("/", maintenanceController.getAllMaintenanceRequests); // Get all maintenance requests
router.get("/:id", maintenanceController.getMaintenanceById); // Get a single maintenance request by ID
router.post("/", maintenanceController.createMaintenanceRequest); // Create a new maintenance request
router.put("/:id", maintenanceController.updateMaintenanceRequest); // Update a maintenance request
router.delete("/:id", maintenanceController.deleteMaintenanceRequest); // Delete a maintenance request

module.exports = router;
