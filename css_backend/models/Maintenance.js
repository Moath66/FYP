const mongoose = require("mongoose");

const MaintenanceSchema = new mongoose.Schema({
  equipment_id: { type: String, required: true, unique: true },
  equipmentType: { type: String, required: true },
  equipmentAge: { type: Number, required: true },
  usagePattern: { type: String },
  environmentalCondition: { type: String },
  description: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
}, { timestamps: true });

module.exports = mongoose.model("Maintenance", MaintenanceSchema);
