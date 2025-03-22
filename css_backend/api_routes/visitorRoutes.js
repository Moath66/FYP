const express = require("express");
const router = express.Router();
const visitorController = require("../controllers/visitorController");

// Routes for visitors
router.get("/", visitorController.getAllVisitors); // Get all visitors
router.get("/:id", visitorController.getVisitorById); // Get a single visitor by ID
router.post("/", visitorController.createVisitor); // Register a new visitor
router.put("/:id", visitorController.updateVisitor); // Update visitor details
router.delete("/:id", visitorController.deleteVisitor); // Delete a visitor record

module.exports = router;
