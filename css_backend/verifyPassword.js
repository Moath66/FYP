const bcrypt = require("bcryptjs");

const plainPassword = "123213"; // Replace with the password you're trying
const hashedPassword = "$2b$10$rxLdUXUBizWfyL8gigN5Q.A5J6ebah7UEuWYIDscnQTw0x2A4zR7."; // Paste from MongoDB

bcrypt.compare(plainPassword, hashedPassword, function (err, isMatch) {
  if (err) {
    console.error("Error comparing passwords:", err);
  } else if (isMatch) {
    console.log("✅ Passwords match!");
  } else {
    console.log("❌ Passwords do NOT match.");
  }
});
