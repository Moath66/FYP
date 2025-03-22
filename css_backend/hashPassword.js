const bcrypt = require('bcrypt');
const saltRounds = 10;
const plainPassword = '123213'; // Change this to the password you want

bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
    if (err) {
        console.error("Error hashing password:", err);
    } else {
        console.log("Hashed Password:", hash);
    }
});
