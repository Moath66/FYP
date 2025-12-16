// api_routes/healthRoutes.js
const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    ok: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
