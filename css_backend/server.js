const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config(); // Load .env variables

const app = express();

// ✅ CORS configuration
const allowedOrigins = [
  "https://fyp-2c62b8tcd-moaths-projects-b83013fe.vercel.app", // ← update this to your actual frontend URL
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ✅ Connect to MongoDB
connectDB();

// ✅ Import Routes
const authRoutes = require("./api_routes/authRoutes");
const adminRoutes = require("./api_routes/adminRoutes");
const residentRoutes = require("./api_routes/residentRoutes");
const securityRoutes = require("./api_routes/securityRoutes");
const staffRoutes = require("./api_routes/staffRoutes");
const userRoutes = require("./api_routes/userRoutes");
const itemRoutes = require("./api_routes/itemRoutes");
const visitorRoutes = require("./api_routes/visitorRoutes");
const maintenanceRoutes = require("./api_routes/maintenanceRoutes");

// ✅ Use Routes
app.use("/api/admin", adminRoutes);
app.use("/api/resident", residentRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/maintenance", maintenanceRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
