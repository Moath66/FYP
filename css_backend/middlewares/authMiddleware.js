const jwt = require("jsonwebtoken");
const mongoose = require("mongoose"); // ✅ Needed for ObjectId conversion

const authMiddleware = (req, res, next) => {
  const rawToken = req.header("Authorization");
  const token =
    rawToken && rawToken.startsWith("Bearer ")
      ? rawToken.split(" ")[1]
      : rawToken;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Safely convert userId to ObjectId if it's not already
    req.user = {
      userId: mongoose.Types.ObjectId.isValid(decoded.userId)
        ? new mongoose.Types.ObjectId(decoded.userId)
        : decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
