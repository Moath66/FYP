const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authMiddleware = (req, res, next) => {
  const rawToken = req.headers["authorization"];
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

    if (!decoded || !decoded.userId || !decoded.role) {
      return res.status(403).json({ message: "Invalid token structure." });
    }

    req.user = {
      userId: mongoose.Types.ObjectId.isValid(decoded.userId)
        ? new mongoose.Types.ObjectId(decoded.userId)
        : decoded.userId,
      role: decoded.role,
    };

    if (process.env.NODE_ENV === "development") {
      console.log("✅ Authenticated user:", req.user);
    }

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
