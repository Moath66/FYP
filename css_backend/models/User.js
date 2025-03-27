const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: { type: Number, unique: true },
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNo: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "resident", "security", "staff"],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
