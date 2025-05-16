const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      unique: true,
    },
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
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    qrCode: String,
    denialReason: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);
