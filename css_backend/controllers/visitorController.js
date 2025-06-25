const Visitor = require("../models/Visitor");
const User = require("../models/User");
const QRCode = require("qrcode");

// ✅ Generate Unique Visitor ID
const generateVisitorId = async () => {
  try {
    const last = await Visitor.findOne({ visitorId: { $ne: null } }).sort({
      createdAt: -1,
    });

    let lastId = last?.visitorId || "VIS000";
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
      return res.status(500).json({ message: "Invalid visitor ID generated" });
    }

    const {
      visitor_name,
      phone_number,
      passport_number,
      purpose,
      date,
      email,
    } = req.body;

    console.log("🔍 Register - req.user.userId:", req.user.userId);
    console.log(
      "🔍 Register - typeof req.user.userId:",
      typeof req.user.userId
    );

    // ✅ FIXED: Use the ObjectId directly to find user
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.error("❌ User not found with ObjectId:", req.user.userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(
      "✅ Found user for visitor registration:",
      user.userName,
      "userId:",
      user.userId
    );

    const visitor = new Visitor({
      visitorId,
      visitor_name,
      phone_number,
      passport_number,
      purpose,
      date,
      email,
      status: "pending",
      submittedBy: user._id, // ✅ FIXED: Use ObjectId instead of numeric userId
    });

    await visitor.save();
    console.log(
      "✅ Visitor registered:",
      visitor.visitorId,
      "for user:",
      user.userName
    );
    res.status(201).json(visitor);
  } catch (err) {
    console.error("❌ registerVisitor error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔹 Get Visitors by Resident
exports.getByResident = async (req, res) => {
  try {
    console.log("🔍 GetByResident - req.user.userId:", req.user.userId);
    console.log(
      "🔍 GetByResident - typeof req.user.userId:",
      typeof req.user.userId
    );

    // ✅ FIXED: Use the ObjectId directly to find visitors
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.error("❌ User not found with ObjectId:", req.user.userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Found user:", user.userName, "with ObjectId:", user._id);

    const visitors = await Visitor.find({ submittedBy: user._id }).sort({
      createdAt: -1,
    });

    console.log("✅ Found visitor records:", visitors.length);
    res.json(visitors);
  } catch (err) {
    console.error("❌ getByResident error:", err);
    res.status(500).json({ message: "Failed to get visitors" });
  }
};

// 🔹 Get All Visitors
exports.getAllVisitors = async (req, res) => {
  try {
    const all = await Visitor.find().sort({ createdAt: -1 });
    console.log("✅ Retrieved all visitor records:", all.length);
    res.json(all);
  } catch (err) {
    console.error("❌ getAllVisitors error:", err);
    res.status(500).json({ message: "Failed to load all visitors" });
  }
};

// 🔹 Get Pending Visitors
exports.getPending = async (req, res) => {
  try {
    const pending = await Visitor.find({ status: "pending" }).sort({
      createdAt: -1,
    });
    console.log("✅ Found pending visitors:", pending.length);
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
    console.log("🔍 Approving visitor:", id);

    const visitor = await Visitor.findById(id).populate("submittedBy");
    if (!visitor) {
      console.error("❌ Visitor not found:", id);
      return res.status(404).json({ message: "Visitor not found" });
    }

    const resident = visitor.submittedBy;
    const security = await User.findById(req.user.userId);

    const qrPayload = {
      visitorId: visitor.visitorId,
      visitor_name: visitor.visitor_name,
      passport_number: visitor.passport_number,
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
    const scanURL = `${baseUrl}/scan-visitor?data=${encoded}`;

    const qrCodeData = await QRCode.toDataURL(scanURL);
    visitor.status = "approved";
    visitor.qrCode = qrCodeData;
    await visitor.save();

    console.log("✅ Visitor approved:", visitor.visitorId);
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

    console.log("🔍 Denying visitor:", id, "reason:", reason);

    const visitor = await Visitor.findById(id);
    if (!visitor) {
      console.error("❌ Visitor not found:", id);
      return res.status(404).json({ message: "Visitor not found" });
    }

    visitor.status = "denied";
    visitor.qrCode = null;
    visitor.denialReason = reason;
    await visitor.save();

    console.log("✅ Visitor denied:", visitor.visitorId);
    res.json({ message: "Visitor denied", visitor });
  } catch (err) {
    console.error("❌ denyVisitor error:", err);
    res.status(500).json({ message: "Failed to deny visitor" });
  }
};
