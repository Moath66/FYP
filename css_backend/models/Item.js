const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  item_id: { type: String, required: true, unique: true },
  itemName: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  description: { type: String },
  status: { type: String, enum: ["lost", "found", "returned"], default: "lost" }, // Track item status
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
}, { timestamps: true });

module.exports = mongoose.model("Item", ItemSchema);
