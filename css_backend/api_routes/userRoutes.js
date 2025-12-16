const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");

// Authentication Routes
router.post("/register", userController.createUser);  // Register a user
router.post("/login", userController.loginUser);  // Login route

// User Management Routes
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id/:userName", userController.deleteUser);

module.exports = router;
