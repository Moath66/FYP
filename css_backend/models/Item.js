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
      ],
      default: "",
    },
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },

    // ✅ The person who reported the item as lost
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ The person who confirmed the item as found
    foundBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ✅ Optional: Track the date the item was found
    foundDate: {
      type: Date,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

module.exports = mongoose.model("Item", itemSchema);
