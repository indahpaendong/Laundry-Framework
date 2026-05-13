// backend/create-admin-railway.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function createAdmin() {
  console.log('🔗 Connecting to Railway...');
  
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  console.log('✅ Connected!\n');

  const email = 'admin@laundrygo.com';
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);

  console.log('📝 Creating admin:');
  console.log('   Email:', email);
  console.log('   Password:', password);
  console.log('   Hash:', hash.substring(0, 30) + '...');

  try {
    await conn.query(
      'INSERT INTO admins (nama, email, password_hash) VALUES (?, ?, ?)',
      ['Super Admin', email, hash]
    );

    console.log('\n✅ Admin berhasil dibuat!');
    console.log('🎉 LOGIN DENGAN:');
    console.log('   Email:', email);
    console.log('   Password:', password);

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('⚠️  Admin sudah ada. Update password...');
      await conn.query(
        'UPDATE admins SET password_hash = ? WHERE email = ?',
        [hash, email]
      );
      console.log('✅ Password di-update!');
    } else {
      console.error('❌ Error:', error.message);
    }
  }

  await conn.end();
}

createAdmin();