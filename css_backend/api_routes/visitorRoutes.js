const express = require("express");
const router = express.Router();
const visitorController = require("../controllers/visitorController");
const auth = require("../middlewares/authMiddleware");

// 🔹 POST - Register new visitor
router.post("/register", auth, visitorController.registerVisitor);

// 🔹 GET - Visitors submitted by a resident
router.get("/byResident/:id", auth, visitorController.getByResident);

// 🔹 GET - Pending visitors (for security)
router.get("/pending", auth, visitorController.getPending);

module.exports = router;
