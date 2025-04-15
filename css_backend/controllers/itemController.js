const Item = require("../models/Item");
const User = require("../models/User");
const QRCode = require("qrcode");

// 🔢 Generate a unique ITEM ID
const generateItemId = async () => {
  const latestItem = await Item.findOne({ itemId: { $exists: true } }).sort({
    createdAt: -1,
  });

  const latestId = latestItem?.itemId || "ITEM000";
  const number = parseInt(latestId.replace("ITEM", "")) + 1;
  return `ITEM${number.toString().padStart(3, "0")}`;
};

// 🟥 Submit Lost Item
const submitLostItem = async (req, res) => {
  try {
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
      status: "lost",
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
    }).select("itemId itemName date location picture description status");

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: "Error matching lost items" });
  }
};

// ✅ Confirm Found Item
const confirmFoundItem = async (req, res) => {
  try {
    const { matchedItemId } = req.body;
    const picturePath = req.file ? `/uploads/${req.file.filename}` : "";

    const item = await Item.findById(matchedItemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.status = "unclaimed";
    item.type = "lost";
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

// 🔁 Update Status
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

// 📅 All Items (Admin/Security)
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("reportedBy", "userId userName role")
      .populate("foundBy", "userId userName role")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

// ✅ Claim Item (Resident)
const claimItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("reportedBy", "userId userName role")
      .populate("foundBy", "userId userName role")
      .lean();

    if (!item || item.status !== "unclaimed") {
      return res
        .status(400)
        .json({ message: "Item is not available to claim" });
    }

    const claimer = await User.findById(req.user.userId).select(
      "userId userName role"
    );

    await Item.findByIdAndUpdate(req.params.id, { status: "claimed" });

    const qrData = {
      itemId: item.itemId,
      itemName: item.itemName,
      location: item.location,
      date: item.date,
      description: item.description,
      status: "claimed",
      picture: item.picture,
      claimedBy: {
        userId: claimer.userId,
        userName: claimer.userName,
        role: claimer.role,
      },
      reportedBy: {
        userId: item.reportedBy?.userId,
        userName: item.reportedBy?.userName,
        role: item.reportedBy?.role,
      },
      foundBy: {
        userId: item.foundBy?.userId,
        userName: item.foundBy?.userName,
        role: item.foundBy?.role,
      },
    };

    const encodedData = encodeURIComponent(JSON.stringify(qrData));
    const scanUrl = `${process.env.REACT_APP_PUBLIC_URL}/scan?data=${encodedData}`;
    const qrCodeImage = await QRCode.toDataURL(scanUrl);

    res.json({
      message: "Item claimed successfully",
      item: { ...item, status: "claimed" },
      qrCode: qrCodeImage,
      qrData,
      scanUrl,
    });
  } catch (err) {
    console.error("QR Code Error:", err);
    res.status(500).json({ message: "Failed to claim item" });
  }
};

// 📦 Items Reported by User
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
    const item = await Item.findById(req.params.id)
      .populate("reportedBy", "userId userName")
      .populate("foundBy", "userId userName role");
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
