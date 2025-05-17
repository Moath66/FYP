const Visitor = require("../models/Visitor");
const User = require("../models/User");
const QRCode = require("qrcode");

// ✅ Generate Unique Visitor ID
const generateVisitorId = async () => {
  try {
    const last = await Visitor.findOne({ visitorId: { $ne: null } }).sort({
      createdAt: -1,
    });

    let lastId = "VIS000";
    if (last?.visitorId) lastId = last.visitorId;

    let number = parseInt(lastId.replace("VIS", "")) + 1;
    let newId;
    let exists = true;

    while (exists) {
      newId = `VIS${number.toString().padStart(3, "0")}`;
      exists = await Visitor.exists({ visitorId: newId });
      number++;
    }

    console.log("✅ Generated visitorId:", newId);
    return newId;
  } catch (err) {
    console.error("❌ Error generating visitorId:", err);
    return null;
  }
};

// 🔹 Register Visitor
exports.registerVisitor = async (req, res) => {
  try {
    const visitorId = await generateVisitorId();

    if (!visitorId || visitorId === "VISNaN") {
      console.error("❌ visitorId generation failed:", visitorId);
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
      submittedBy: req.user.userId || req.user._id,
    });

    await visitor.save();
    console.log("✅ Visitor registered:", visitor);
    res.status(201).json(visitor);
  } catch (err) {
    console.error("❌ registerVisitor error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔹 Get All Visitors
exports.getAllVisitors = async (req, res) => {
  try {
    const all = await Visitor.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: "Failed to load all visitors" });
  }
};

// 🔹 Get Visitors by Resident
exports.getByResident = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const visitors = await Visitor.find({ submittedBy: userId }).sort({
      createdAt: -1,
    });
    res.json(visitors);
  } catch (err) {
    console.error("❌ getByResident error:", err);
    res.status(500).json({ message: "Failed to get visitors" });
  }
};

// 🔹 Get Pending Visitors (Security)
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

// 🔹 Approve Visitor & Generate QR Code
exports.approveVisitor = async (req, res) => {
  try {
    const id = req.params.id;
    const visitor = await Visitor.findById(id).populate("submittedBy");

    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    const resident = visitor.submittedBy;
    const security = await User.findById(req.user.userId);

    // Build payload
    const qrPayload = {
      visitorId: visitor.visitorId,
      visitor_name: visitor.visitor_name,
      phone_number: visitor.phone_number,
      email: visitor.email,
      purpose: visitor.purpose,
      date: visitor.date,
      status: "approved",
      submittedBy: {
        userId: resident.userId,
        userName: resident.userName,
        role: resident.role,
      },
      approvedBy: {
        userId: security.userId,
        userName: security.userName,
        role: security.role,
      },
    };

    const baseUrl = req.headers.origin || process.env.REACT_APP_PUBLIC_URL;
    const encoded = encodeURIComponent(JSON.stringify(qrPayload));
    const scanURL = `${baseUrl}/scan?data=${encoded}`;

    const qrCodeData = await QRCode.toDataURL(scanURL);

    visitor.status = "approved";
    visitor.qrCode = qrCodeData;
    await visitor.save();

    res.json({ message: "Visitor approved", visitor });
  } catch (err) {
    console.error("❌ approveVisitor error:", err);
    res.status(500).json({ message: "Failed to approve visitor" });
  }
};

// 🔹 Deny Visitor
exports.denyVisitor = async (req, res) => {
  try {
    const id = req.params.id;
    const { reason } = req.body;

    const visitor = await Visitor.findById(id);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    visitor.status = "denied";
    visitor.qrCode = null;
    visitor.denialReason = reason;
    await visitor.save();

    res.json({ message: "Visitor denied", visitor });
  } catch (err) {
    console.error("❌ denyVisitor error:", err);
    res.status(500).json({ message: "Failed to deny visitor" });
  }
};
