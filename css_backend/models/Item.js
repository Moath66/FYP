const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      unique: true,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    picture: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "lost",
        "found",
        "unclaimed",
        "claimed",
        "returned",
        "discarded",
        "",
      ], // add "" to enum!
      default: "",
    },

    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
); // ✅ Adds createdAt and updatedAt

module.exports = mongoose.model("Item", itemSchema);
