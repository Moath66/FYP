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

    const residentId = req.user.userId || req.user._id;

    const request = new Maintenance({
      eq_type,
      eq_age,
      usage_pattern,
      environment_condition,
      description,
      last_maintenance_date,
      resident_id: residentId,
      staffAction: null,
      status: "Pending",
    });

    await request.save();
    console.log("✅ Maintenance submitted:", request);
    res.status(201).json(request);
  } catch (err) {
    console.error("❌ submitMaintenance error:", err);
    res.status(500).json({ message: "Failed to submit maintenance request" });
  }
};

// 🔹 Get Maintenance by Resident
exports.getByResident = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const data = await Maintenance.find({ resident_id: userId }).sort({
      createdAt: -1,
    });
    res.json(data);
  } catch (err) {
    console.error("❌ getByResident error:", err);
    res.status(500).json({ message: "Failed to fetch maintenance data" });
  }
};

// 🔹 Get All Maintenance Requests (Staff)
exports.getAllMaintenance = async (req, res) => {
  try {
    const all = await Maintenance.find()
      .populate("resident_id", "userName role")
      .sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    console.error("❌ getAllMaintenance error:", err);
    res.status(500).json({ message: "Failed to load all maintenance records" });
  }
};

// 🔹 Update Maintenance Status (Staff Action)
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
    console.log(`✅ Maintenance updated (action: ${staffAction})`);

    res.json({ message: "Maintenance status updated", maintenance });
  } catch (err) {
    console.error("❌ updateMaintenanceStatus error:", err);
    res.status(500).json({ message: "Failed to update maintenance status" });
  }
};
