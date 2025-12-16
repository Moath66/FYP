const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


router.post("/login", userController.loginUser);  // Login route

// 📌 Login (supports email or username via identifier)
router.post("/login", userController.loginUser);

// 📌 Register (optional if using registration from frontend)
router.post("/register", userController.createUser);

// 📌 Forgot Password
router.post("/forgot-password", async (req, res) => {
  const nodemailer = require("nodemailer");
  const User = require("../models/User");
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.markModified("resetCode");
    user.markModified("resetCodeExpires");
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Password Reset Code",
      text: `Here is your password reset code: ${resetCode}`,
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ Reset email sent to ${email}`);
    res.json({ message: "Reset code sent to your email." });
  } catch (err) {
    console.error("🔥 Forgot Password Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 📌 Reset Password
router.post("/reset-password", async (req, res) => {
  const bcrypt = require("bcryptjs");
  const User = require("../models/User");
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.resetCode || String(user.resetCode) !== String(code)) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    if (Date.now() > user.resetCodeExpires) {
      return res.status(400).json({ message: "Code expired, please request again" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.json({ message: "✅ Password reset successfully. Please log in again." });
  } catch (err) {
    console.error("🔥 Reset Password Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
