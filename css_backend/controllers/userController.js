require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 📌 Utility function to generate unique incremental `userId`
const getNextUserId = async () => {
  const lastUser = await User.findOne().sort({ userId: -1 });
  return lastUser ? lastUser.userId + 1 : 1;
};

// 📌 Get all users
// ✅ Correct: Only include selected fields
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "userId userName email role");
    res.status(200).json(users);
  } catch (error) {
    console.error("🔥 getAllUsers error:", error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};



// 📌 Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ userId: Number(req.params.id) }).select(
      "-password"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

// 📌 Create a new user (Registration)
exports.createUser = async (req, res) => {
  try {
    const { userName, email, password, phoneNo, role } = req.body;

    if (!userName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUserId = await getNextUserId(); // 🆕 Generate unique `userId`
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userId: newUserId,
      userName,
      email,
      password: hashedPassword,
      phoneNo,
      role,
    });

    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      user: { userId: newUserId, userName, email, phoneNo, role },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

// 📌 Update user
exports.updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      return res
        .status(400)
        .json({ message: "Use password reset function to update password" });
    }

    if (req.body.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser && existingUser.userId !== Number(req.params.id)) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId: Number(req.params.id) },
      req.body,
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

// 📌 Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({
      userId: Number(req.params.id),
    });
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: `User ${deletedUser.userName} with ID ${deletedUser.userId} deleted successfully`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

// 📌 User Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let dashboardUrl = "/user/profile";
    switch (user.role) {
      case "admin":
        dashboardUrl = "/admin/dashboard";
        break;
      case "resident":
        dashboardUrl = "/resident/dashboard";
        break;
      case "security":
        dashboardUrl = "/security/dashboard";
        break;
      case "staff":
        dashboardUrl = "/staff/dashboard";
        break;
    }

    const token = jwt.sign(
      { userId: user.userId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.userId,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
      dashboard: dashboardUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
};
