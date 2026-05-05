const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email dan password wajib diisi' 
      });
    }

    // Cari admin di database
    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email atau password salah' 
      });
    }

    const admin = rows[0];

    // Cek password (bcrypt)
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email atau password salah' 
      });
    }

    // Buat JWT token
    const token = jwt.sign(
      { 
        id: admin.id, 
        nama: admin.nama, 
        email: admin.email,
        role: 'admin' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        admin: {
          id: admin.id,
          nama: admin.nama,
          email: admin.email
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
};

// Logout
exports.logout = (req, res) => {
  // Di JWT, logout dilakukan di frontend (hapus token)
  res.json({
    success: true,
    message: 'Logout berhasil'
  });
};