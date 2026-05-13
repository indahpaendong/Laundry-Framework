// test-db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

console.log('=== 🔍 DEBUG ENV ===');
console.log('DB_HOST:', process.env.DB_HOST, `(type: ${typeof process.env.DB_HOST})`);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('====================');

(async () => {
  console.log('🔍 Connecting to:', process.env.DB_HOST);
  
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false } // ← Wajib untuk Railway!
    });
    
    console.log('✅ Terhubung!');
    
    // Test 1: Count orders
    const [countResult] = await conn.query('SELECT COUNT(*) AS total FROM orders');
    console.log('📊 Total orders:', countResult[0].total);
    
    // Test 2: Ambil data terbaru
    const [latest] = await conn.query('SELECT id, kode, nama_customer, status FROM orders ORDER BY id DESC LIMIT 1');
    console.log('📦 Order terakhir:', latest[0] || '(kosong)');
    
    await conn.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('💡 Code:', err.code);
    console.error('💡 SQL State:', err.sqlState);
  }
})();