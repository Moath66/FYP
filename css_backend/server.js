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
  "https://fyp-dar66ejvb-moaths-projects-b83013fe.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded images from backend/uploads folder
app.use("/uploads", express.static("uploads"));

// ✅ MongoDB Connection
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

// ✅ Serve React Frontend Build (for Production)
const frontendPath = path.join(__dirname, "../css_frontend/build");
app.use(express.static(frontendPath));

// ✅ Catch-all route to handle SPA routing and serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
