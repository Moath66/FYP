const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config(); // Load .env variables

// ✅ Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📁 'uploads' folder created.");
}

const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
  "https://fyp-ek6ojrov0-moaths-projects-b83013fe.vercel.app", // your Vercel frontend
  "http://localhost:3000", // for local development
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded images
app.use("/uploads", express.static("uploads"));

// ✅ Connect MongoDB
connectDB();

// ✅ API Routes
app.use("/api/admin", require("./api_routes/adminRoutes"));
app.use("/api/resident", require("./api_routes/residentRoutes"));
app.use("/api/security", require("./api_routes/securityRoutes"));
app.use("/api/staff", require("./api_routes/staffRoutes"));
app.use("/api/auth", require("./api_routes/authRoutes"));
app.use("/api/users", require("./api_routes/userRoutes"));
app.use("/api/items", require("./api_routes/itemRoutes"));
app.use("/api/visitors", require("./api_routes/visitorRoutes"));
app.use("/api/maintenance", require("./api_routes/maintenanceRoutes"));

// ❌ DO NOT SERVE frontend build when using Vercel
// ❌ This avoids 401 errors for manifest.json or index.html

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
