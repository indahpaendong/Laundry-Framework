const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 48254,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test koneksi
pool.getConnection()
  .then(conn => {
    console.log('✅ Database MySQL terhubung!');
    console.log('📍 Host:', process.env.DB_HOST);
    console.log('📦 Database:', process.env.DB_NAME);
    console.log('🔌 Port:', process.env.DB_PORT);
    conn.release();
  })
  .catch(err => {
    console.error('❌ Gagal konek database:', err.message);
    console.error('🔍 Debug info:');
    console.error('  - DB_HOST:', process.env.DB_HOST || 'NOT SET');
    console.error('  - DB_PORT:', process.env.DB_PORT || 'NOT SET');
    console.error('  - DB_USER:', process.env.DB_USER || 'NOT SET');
    console.error('  - DB_PASS:', process.env.DB_PASS ? '*** SET ***' : 'NOT SET');
    console.error('  - DB_NAME:', process.env.DB_NAME || 'NOT SET');
  });

module.exports = pool;