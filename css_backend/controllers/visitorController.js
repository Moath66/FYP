const Visitor = require("../models/Visitor");

const generateVisitorId = async () => {
  const last = await Visitor.findOne().sort({ createdAt: -1 });
  const lastId = last?.visitorId || "VIS000";
  const number = parseInt(lastId.replace("VIS", "")) + 1;
  return `VIS${number.toString().padStart(3, "0")}`;
};

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
      submittedBy: req.user.userId,
    });

    await visitor.save();
    res.status(201).json(visitor);
  } catch (err) {
    console.error("❌ registerVisitor error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getByResident = async (req, res) => {
  try {
    const visitors = await Visitor.find({ submittedBy: req.params.id });
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: "Failed to get visitors" });
  }
};

exports.getPending = async (req, res) => {
  try {
    const pending = await Visitor.find({ status: "pending" });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: "Failed to load pending visitors" });
  }
};
