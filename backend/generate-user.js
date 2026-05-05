// generate-user.js
const bcrypt = require("bcrypt");

async function createHash(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log("Password:", password);
  console.log("Hash:", hash);
  console.log("---");
}

// Jalankan untuk admin dan mahasiswa
createHash("admin123");      // → hash untuk admin
createHash("");  // → hash untuk mahasiswa