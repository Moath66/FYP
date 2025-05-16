const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
  visitorId: String,
  visitor_name: String,
  phone_number: String,
  purpose: String,
  date: Date,
  email: String,
  status: {
    type: String,
    enum: ["pending", "approved", "denied"],
    default: "pending",
  },
  qrCode: String,
  denialReason: String,
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Visitor", VisitorSchema);
