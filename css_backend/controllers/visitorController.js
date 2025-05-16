const Visitor = require("../models/Visitor");

// 🔹 Helper: Generate Unique Visitor ID
const generateVisitorId = async () => {
  const last = await Visitor.findOne().sort({ createdAt: -1 });
  const lastId = last?.visitorId || "VIS000";
  const number = parseInt(lastId.replace("VIS", "")) + 1;
  return `VIS${number.toString().padStart(3, "0")}`;
};

// 🔹 POST: Register Visitor
exports.registerVisitor = async (req, res) => {
  try {
    const visitorId = await generateVisitorId();
    const { visitor_name, phone_number, purpose, date, email } = req.body;

    const visitor = new Visitor({
      visitorId,
      visitor_name,
      phone_number,
      purpose,
      date,
      email,
      status: "pending",
      submittedBy: req.user.userId,
    });

    await visitor.save();
    res.status(201).json(visitor);
  } catch (err) {
    console.error("❌ registerVisitor error:", err);
    res.status(500).json({ message: "Server error" });
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

// 🔹 GET: All Pending Visitors (for security)
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
