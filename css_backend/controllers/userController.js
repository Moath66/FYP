require("dotenv").config(); // Load environment variables at the top
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

// Create a new user (Registration)
exports.createUser = async (req, res) => {
  try {
    const { userName, email, password, phoneNo, role } = req.body;

    if (!userName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ userName, email, password: hashedPassword, phoneNo, role });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: { userName, email, phoneNo, role } });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    // Prevent password updates directly
    if (req.body.password) {
      return res.status(400).json({ message: "Use password reset function to update password" });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Debugging: Log entered and stored passwords
    console.log("Entered password:", password);
    console.log("Hashed password from DB:", user.password);

    // Validate password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match Result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Role-based dashboard redirection
    let dashboardUrl = "";
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
      default:
        dashboardUrl = "/user/profile";
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
      dashboard: dashboardUrl, // Redirect based on role
    });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
};
