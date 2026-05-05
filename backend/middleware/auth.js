const jwt = require('jsonwebtoken');

// Middleware untuk proteksi route
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Akses ditolak. Token tidak ditemukan' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Token tidak valid atau kadaluarsa' 
      });
    }
    req.user = user; // Simpan info user di request
    next(); // Lanjut ke controller
  });
};