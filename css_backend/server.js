const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config(); // Load .env variables

const app = express();

// ✅ Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📁 'uploads' folder created.");
}

// ✅ CORS Configuration (for credentials + origin check)
const allowedOrigins = [
  "https://fyp-945m6blim-moaths-projects-b83013fe.vercel.app",
  "https://fyp-kappa-flame.vercel.app",
  "http://localhost:3000",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// ✅ Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve Uploaded Files
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
  console.log(`✅ Allowed Origins: ${allowedOrigins.join(", ")}`);
});
