const express = require("express");
const router = express.Router();
const visitorController = require("../controllers/visitorController");
const auth = require("../middlewares/authMiddleware");

router.post("/register", auth, visitorController.registerVisitor);
router.get("/byResident/:id", auth, visitorController.getByResident);
router.get("/pending", auth, visitorController.getPending);

module.exports = router;
