const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,  // ✅ Sesuai dengan Railway: DB_PASSWORD
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
    conn.release();
  })
  .catch(err => {
    console.error('❌ Gagal konek database:', err.message);
    console.error('🔍 Cek variables di Railway:');
    console.error('  - DB_HOST:', process.env.DB_HOST ? '✅ set' : '❌ NOT SET');
    console.error('  - DB_USER:', process.env.DB_USER ? '✅ set' : '❌ NOT SET');
    console.error('  - DB_PASSWORD:', process.env.DB_PASSWORD ? '✅ set' : '❌ NOT SET');
    console.error('  - DB_NAME:', process.env.DB_NAME ? '✅ set' : '❌ NOT SET');
  });

module.exports = pool;