const mongoose = require("mongoose");

const MaintenanceSchema = new mongoose.Schema(
  {
    equipment_id: {
      type: String,
      unique: true,
      required: true,
    },
    eq_type: { type: String, required: true },
    eq_age: { type: String, required: true },
    usage_pattern: { type: String, required: true },
    environment_condition: { type: String, required: true },
    description: { type: String, required: true },
    last_maintenance_date: { type: Date, required: true },
    resident_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    staffAction: {
      type: String,
      enum: ["replace", "checking", "no_checking", null],
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", MaintenanceSchema);
