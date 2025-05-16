const Visitor = require("../models/Visitor");

// 🔹 Helper: Generate Unique Visitor ID
const generateVisitorId = async () => {
  try {
    // Filter out documents with null visitorId to avoid duplicate key errors
    const last = await Visitor.findOne({ visitorId: { $ne: null } }).sort({
      createdAt: -1,
    });
    const lastId = last?.visitorId || "VIS000";
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
    if (!visitorId) {
      return res.status(500).json({ message: "Failed to generate visitor ID" });
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
    const visitors = await Visitor.find({ submittedBy: req.params.id }).sort({
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
