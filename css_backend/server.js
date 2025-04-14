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

// ✅ CORS Configuration with dynamic origin
const allowedOrigins = [
  "https://fyp-2c62b8tcd-moaths-projects-b83013fe.vercel.app", // your deployed frontend
  "http://localhost:3000", // local frontend dev
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman) or from allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Handle preflight requests

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded images from backend/uploads
app.use("/uploads", express.static("uploads"));

// ✅ Connect to MongoDB
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

// ❌ DO NOT serve frontend build (because Vercel handles it)
// If you serve frontend from Express (Render), it can cause manifest.json 401 errors

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
