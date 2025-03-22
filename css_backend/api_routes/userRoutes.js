const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Authentication Routes
router.post("/register", userController.createUser);  // Register a user
router.post("/login", userController.loginUser);  // Login route
router.get("/:id", userController.getUserById);  // Get user by ID
router.put("/:id", userController.updateUser);  // Update user info
router.delete("/:id", userController.deleteUser);  // Delete user

module.exports = router;
