// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// ✅ Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📁 'uploads' folder created.");
}

// ✅ Clean CORS setup (no noisy logs)
// Allow: localhost + your main Vercel URL + any *.vercel.app
const allowedOrigins = [
  "http://localhost:3000",
  process.env.REACT_APP_PUBLIC_URL, // e.g. https://fyp-3v962gant-moaths-projects-b83013fe.vercel.app
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // ✅ allow requests without Origin (UptimeRobot / server-to-server / bots)
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin);

      return isAllowed
        ? callback(null, true)
        : callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Preflight
app.options("*", cors());

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
const userRoutes = require("./api_routes/userRoutes");
const itemRoutes = require("./api_routes/itemRoutes");
const visitorRoutes = require("./api_routes/visitorRoutes");
const maintenanceRoutes = require("./api_routes/maintenanceRoutes");
const healthRoutes = require("./api_routes/healthRoutes");

// ✅ Optional: root check (helps if someone hits /)
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// ✅ Use Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api", healthRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("✅ Allowed Origins:", allowedOrigins, "and *.vercel.app");
});
