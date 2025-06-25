const Maintenance = require("../models/Maintenance");
const User = require("../models/User");

// 🔹 Submit New Maintenance Request (Resident)
exports.submitMaintenance = async (req, res) => {
  try {
    const {
      eq_type,
      eq_age,
      usage_pattern,
      environment_condition,
      description,
      last_maintenance_date,
    } = req.body;

    console.log("🔍 Submit - req.user.userId:", req.user.userId);
    console.log("🔍 Submit - typeof req.user.userId:", typeof req.user.userId);

    // ✅ FIXED: Use the ObjectId directly to find user
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.error("❌ User not found with ObjectId:", req.user.userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(
      "✅ Found user for submission:",
      user.userName,
      "userId:",
      user.userId
    );

    // Generate unique equipment_id
    const lastEntry = await Maintenance.findOne({}).sort({ createdAt: -1 });
    let lastId = lastEntry?.equipment_id || "EQ0000";
    let number = parseInt(lastId.replace("EQ", "")) + 1;
    const equipment_id = `EQ${number.toString().padStart(4, "0")}`;

    const request = new Maintenance({
      equipment_id,
      eq_type,
      eq_age,
      usage_pattern,
      environment_condition,
      description,
      last_maintenance_date: new Date(last_maintenance_date),
      resident_id: user._id, // Use the ObjectId
      staffAction: null,
      status: "Pending",
    });

    await request.save();
    console.log(
      "✅ Maintenance submitted with:",
      equipment_id,
      "for user:",
      user.userName
    );
    res.status(201).json(request);
  } catch (err) {
    console.error("❌ submitMaintenance error:", err.message);
    res.status(500).json({
      message: "Failed to submit maintenance request",
      error: err.message,
    });
  }
};

// 🔹 Get Maintenance by Resident
exports.getByResident = async (req, res) => {
  try {
    console.log("🔍 GetByResident - req.params.id:", req.params.id);
    console.log(
      "🔍 GetByResident - typeof req.params.id:",
      typeof req.params.id
    );

    // ✅ Better validation and conversion
    const userIdParam = req.params.id;
    if (!userIdParam) {
      console.error("❌ Missing user ID parameter");
      return res.status(400).json({ message: "User ID parameter is required" });
    }

    const numericUserId = Number(userIdParam);
    console.log("🔍 Converted to number:", numericUserId);

    if (isNaN(numericUserId)) {
      console.error("❌ Invalid userId parameter (NaN):", userIdParam);
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // ✅ Find user by numeric userId
    const user = await User.findOne({ userId: numericUserId });
    if (!user) {
      console.error("❌ User not found with userId:", numericUserId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Found user:", user.userName, "with ObjectId:", user._id);

    // ✅ Find maintenance records by user's ObjectId
    const data = await Maintenance.find({ resident_id: user._id }).sort({
      createdAt: -1,
    });

    console.log("✅ Found maintenance records:", data.length);
    res.json(data);
  } catch (err) {
    console.error("❌ getByResident error:", err.message);
    res.status(500).json({
      message: "Failed to fetch maintenance data",
      error: err.message,
    });
  }
};

// 🔹 Get All Maintenance Requests (Staff)
exports.getAllMaintenance = async (req, res) => {
  try {
    const all = await Maintenance.find()
      .populate("resident_id", "userName role")
      .sort({ createdAt: -1 });

    console.log("✅ Retrieved all maintenance records:", all.length);
    res.json(all);
  } catch (err) {
    console.error("❌ getAllMaintenance error:", err.message);
    res.status(500).json({
      message: "Failed to load all maintenance records",
      error: err.message,
    });
  }
};

// 🔹 Update Maintenance Status (Staff Action)
exports.updateMaintenanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { staffAction } = req.body;

    console.log("🔍 Updating maintenance:", id, "with action:", staffAction);

    const allowed = ["replace", "checking", "no_checking"];
    if (!allowed.includes(staffAction)) {
      console.error("❌ Invalid staff action:", staffAction);
      return res.status(400).json({ message: "Invalid staff action" });
    }

    const maintenance = await Maintenance.findById(id);
    if (!maintenance) {
      console.error("❌ Maintenance request not found:", id);
      return res.status(404).json({ message: "Maintenance request not found" });
    }

    maintenance.staffAction = staffAction;
    maintenance.status = "Completed";

    await maintenance.save();
    console.log(`✅ Maintenance ${id} updated → Action: ${staffAction}`);

    res.json({ message: "Maintenance status updated", maintenance });
  } catch (err) {
    console.error("❌ updateMaintenanceStatus error:", err.message);
    res.status(500).json({
      message: "Failed to update maintenance status",
      error: err.message,
    });
  }
};
