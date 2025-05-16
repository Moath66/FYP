const Visitor = require("../models/Visitor");

const generateVisitorId = async () => {
  try {
    const last = await Visitor.findOne({ visitorId: { $ne: null } }).sort({
      createdAt: -1,
    });

    let lastId = "VIS000";
    if (last && last.visitorId) {
      lastId = last.visitorId;
    }

    const number = parseInt(lastId.replace("VIS", "")) + 1;
    return `VIS${number.toString().padStart(3, "0")}`;
  } catch (err) {
    console.error("❌ Error generating visitorId:", err);
    return null;
  }
};

// 🔹 POST: Register Visitor
exports.registerVisitor = async (req, res) => {
  try {
    const visitorId = await generateVisitorId();
    if (!visitorId || visitorId.includes("NaN")) {
      return res.status(500).json({ message: "Invalid visitor ID generated" });
    }

    const { visitor_name, phone_number, purpose, date, email } = req.body;

    const visitor = new Visitor({
      visitorId,
      visitor_name,
      phone_number,
      purpose,
      date,
      email,
      status: "pending",
      submittedBy: req.user.userId || req.user._id, // Compatible with both token styles
    });

    await visitor.save();
    console.log("✅ Visitor registered:", visitor);
    res.status(201).json(visitor);
  } catch (err) {
    console.error("❌ registerVisitor error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔹 GET: Visitors by Resident
exports.getByResident = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id; // Get from token
    const visitors = await Visitor.find({ submittedBy: userId }).sort({
      createdAt: -1,
    });
    res.json(visitors);
  } catch (err) {
    console.error("❌ getByResident error:", err);
    res.status(500).json({ message: "Failed to get visitors" });
  }
};
// 🔹 GET: All Pending Visitors (for security dashboard)
exports.getPending = async (req, res) => {
  try {
    const pending = await Visitor.find({ status: "pending" }).sort({
      createdAt: -1,
    });
    res.json(pending);
  } catch (err) {
    console.error("❌ getPending error:", err);
    res.status(500).json({ message: "Failed to load pending visitors" });
  }
};
