const express = require("express");
const router = express.Router();
const visitorController = require("../controllers/visitorController");
const auth = require("../middlewares/authMiddleware");

// 🔹 POST - Register new visitor
router.post("/register", auth, visitorController.registerVisitor);

// 🔹 GET - Visitors submitted by the logged-in resident
router.get("/byResident", auth, visitorController.getByResident);

// 🔹 GET - Pending visitors (for security)
router.get("/pending", auth, visitorController.getPending);

// ADD these:
router.patch("/approve/:id", auth, visitorController.approveVisitor);
router.patch("/deny/:id", auth, visitorController.denyVisitor);
router.get("/all", auth, visitorController.getAllVisitors);

module.exports = router;
