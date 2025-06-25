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

    // ✅ FIXED: Use the ObjectId directly to find user, then get numeric userId
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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
    console.log("✅ Maintenance submitted with:", equipment_id);
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
    // ✅ FIXED: Convert string parameter to Number for userId search
    const user = await User.findOne({ userId: Number(req.params.id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const data = await Maintenance.find({ resident_id: user._id }).sort({
      createdAt: -1,
    });
    res.json(data);
  } catch (err) {
    console.error("❌ getByResident error:", err.message);
    res.status(500).json({
      message: "Failed to fetch maintenance data",
      error: err.message,
    });
  }
};

// Keep other functions unchanged
exports.getAllMaintenance = async (req, res) => {
  try {
    const all = await Maintenance.find()
      .populate("resident_id", "userName role")
      .sort({ createdAt: -1 });

    res.json(all);
  } catch (err) {
    console.error("❌ getAllMaintenance error:", err.message);
    res.status(500).json({
      message: "Failed to load all maintenance records",
      error: err.message,
    });
  }
};

exports.updateMaintenanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { staffAction } = req.body;

    const allowed = ["replace", "checking", "no_checking"];
    if (!allowed.includes(staffAction)) {
      return res.status(400).json({ message: "Invalid staff action" });
    }

    const maintenance = await Maintenance.findById(id);
    if (!maintenance) {
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
