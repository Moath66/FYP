const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// ✅ This assumes you now export a single middleware function in authMiddleware.js
const authMiddleware = require("../middlewares/authMiddleware");

const {
  submitLostItem,
  matchLostItems,
  confirmFoundItem,
  updateItemStatus,
  getAllItems,
  claimItem,
  getItemsByUser,
  getItemById,
} = require("../controllers/itemController");

// 🔹 Multer Setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

// ✅ Routes
router.post("/lost", authMiddleware, upload.single("picture"), submitLostItem);

router.post("/found/search", authMiddleware, matchLostItems);

router.post(
  "/found/confirm",
  authMiddleware,
  upload.single("picture"),
  confirmFoundItem
);

router.put("/status/:id", authMiddleware, updateItemStatus);

router.post("/claim/:id", authMiddleware, claimItem);

router.get("/all", authMiddleware, getAllItems);

// 🔁 Place this before `/:id` to avoid conflict
router.get("/by-user/:userId", authMiddleware, getItemsByUser);

router.get("/:id", authMiddleware, getItemById);

module.exports = router;
