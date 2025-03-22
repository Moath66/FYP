const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Import database connection

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// Import Routes
const authRoutes = require("./api_routes/authRoutes"); 
const adminRoutes = require("./api_routes/adminRoutes");
const residentRoutes = require("./api_routes/residentRoutes");
const securityRoutes = require("./api_routes/securityRoutes");
const staffRoutes = require("./api_routes/staffRoutes");
const userRoutes = require("./api_routes/userRoutes");
const itemRoutes = require("./api_routes/itemRoutes");
const visitorRoutes = require("./api_routes/visitorRoutes");
const maintenanceRoutes = require("./api_routes/maintenanceRoutes");

// Use Routes
app.use("/api/admin", adminRoutes);
app.use("/api/resident", residentRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/maintenance", maintenanceRoutes);

// Connect to MongoDB using `db.js`
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
