require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 📌 Generate unique incremental userId
const getNextUserId = async () => {
  const lastUser = await User.findOne().sort({ userId: -1 });
  return lastUser ? lastUser.userId + 1 : 1;
};

// 📌 Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "userId userName email role");
    res.status(200).json(users);
  } catch (error) {
    console.error("🔥 getAllUsers error:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// 📌 Get user by ID (Include password)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ userId: Number(req.params.id) });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

// 📌 Register new user
exports.createUser = async (req, res) => {
  try {
    const { userName, email, password, phoneNo, role } = req.body;

if (!userName || !email || !password || !phoneNo || !role) {
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

      const existingUserName = await User.findOne({ userName });
if (existingUserName) return res.status(400).json({ message: "Username already in use" });
    }

    const newUserId = await getNextUserId();
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

// 📌 Update user (except password)
exports.updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      return res
        .status(400)
        .json({ message: "Use password reset to update password" });
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
    const userId = Number(req.params.id);
    const userName = req.params.userName;

    const deletedUser = await User.findOneAndDelete({ userId, userName });

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

// 📌 Login with email or userName (identifier)
exports.loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body; // <-- was 'email'

    const user =
      (await User.findOne({ email: identifier })) ||
      (await User.findOne({ userName: identifier }));

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role }, // 👈 use _id here
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        userId: user.userId,
        userName: user.userName,
        email: user.email,
        phoneNo: user.phoneNo,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
};
