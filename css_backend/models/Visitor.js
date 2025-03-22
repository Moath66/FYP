const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
  visitor_id: { type: String, required: true, unique: true },
  visitor_name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  purposeOfVisit: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  email: { type: String, required: true },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
}, { timestamps: true });

module.exports = mongoose.model("Visitor", VisitorSchema);
