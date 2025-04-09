const Item = require("../models/Item");
const User = require("../models/User");
const QRCode = require("qrcode");
const mongoose = require("mongoose");

// 🔢 Generate a unique ITEM ID
const generateItemId = async () => {
  const latestItem = await Item.findOne({ itemId: { $exists: true } })
    .sort({ createdAt: -1 })
    .lean();

  const latestId = latestItem?.itemId || "ITEM000";
  const number = parseInt(latestId.replace("ITEM", "")) + 1;
  return `ITEM${number.toString().padStart(3, "0")}`;
};

// 🟥 Submit Lost Item
const submitLostItem = async (req, res) => {
  try {
    console.log("✅ Reported by userId:", req.user.userId);

    const itemId = await generateItemId();
    const picturePath = req.file ? `/uploads/${req.file.filename}` : "";
    const itemDate = new Date(req.body.date);

    if (isNaN(itemDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const newItem = new Item({
      itemId,
      itemName: req.body.itemName,
      location: req.body.location,
      date: itemDate,
      description: req.body.description,
      picture: picturePath,
      type: "lost",
      status: "lost", // lost item initially has no status
      reportedBy: req.user.userId,
    });

    await newItem.save();
    res.status(201).json({ message: "Lost item submitted", item: newItem });
  } catch (err) {
    console.error("❌ submitLostItem error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔍 Match Lost Items by Name
const matchLostItems = async (req, res) => {
  try {
    const { itemName } = req.body;
    if (!itemName)
      return res.status(400).json({ message: "Missing item name" });

    const matches = await Item.find({
      itemName: { $regex: new RegExp(itemName, "i") },
      type: "lost",
    }).select("itemId itemName date location picture");

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: "Error matching lost items" });
  }
};

// ✅ Confirm Found Item (update existing lost item)
const confirmFoundItem = async (req, res) => {
  try {
    const { matchedItemId } = req.body;
    const picturePath = req.file ? `/uploads/${req.file.filename}` : "";

    const item = await Item.findById(matchedItemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.status = "unclaimed"; // makes it claimable
    item.type = "lost"; // keep as lost
    if (picturePath) item.picture = picturePath;
    item.foundDate = new Date();
    item.foundBy = req.user.userId;

    await item.save();

    res.status(200).json({ message: "Item marked as found", item });
  } catch (err) {
    console.error("❌ confirmFoundItem error:", err);
    res.status(500).json({ message: "Error confirming found item" });
  }
};

// 🔁 Security Updates Status
const updateItemStatus = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.status = req.body.status;
    await item.save();
    res.json({ message: "Status updated", item });
  } catch (err) {
    res.status(500).json({ message: "Failed to update item status" });
  }
};

// 📥 Get All Items (for Admin/Security)
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("reportedBy", "userName")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

// ✅ Claim Item (resident)
const claimItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "reportedBy",
      "userName"
    );

    if (!item || item.status !== "unclaimed") {
      return res
        .status(400)
        .json({ message: "Item is not available to claim" });
    }

    item.status = "claimed";
    await item.save();

    const claimer = await User.findById(req.user.userId).select("userName");

    const qrData = {
      itemId: item.itemId,
      itemName: item.itemName,
      location: item.location,
      date: item.date,
      description: item.description,
      status: item.status,
      claimedBy: {
        userId: req.user.userId,
        userName: claimer.userName,
      },
      reportedBy: {
        userId: item.reportedBy._id,
        userName: item.reportedBy.userName,
      },
    };

    const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrData));

    res.json({
      message: "Item claimed successfully",
      item,
      qrCode: qrCodeImage,
      qrData,
    });
  } catch (err) {
    console.error("QR Code Error:", err);
    res.status(500).json({ message: "Failed to claim item" });
  }
};

// 📦 Get Items Reported by User
const getItemsByUser = async (req, res) => {
  try {
    const user = await User.findOne({ userId: Number(req.params.userId) });
    if (!user) return res.status(404).json({ message: "User not found" });

    const items = await Item.find({ reportedBy: user._id }).sort({
      createdAt: -1,
    });

    res.json(items);
  } catch (err) {
    console.error("❌ getItemsByUser error:", err);
    res.status(500).json({ message: "Error fetching user items" });
  }
};

// 📄 Get Item by ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "reportedBy",
      "userName"
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error fetching item" });
  }
};

module.exports = {
  submitLostItem,
  matchLostItems,
  confirmFoundItem,
  updateItemStatus,
  getAllItems,
  claimItem,
  getItemsByUser,
  getItemById,
};
