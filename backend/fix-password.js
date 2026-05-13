const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixAdminPassword() {
  let connection;
  try {
    // Koneksi ke Railway
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

    console.log('✅ Connected to Railway database');

    // Generate hash untuk password 'admin123'
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('Generated hash:', hashedPassword);

    // UPDATE password admin yang sudah ada
    const [result] = await connection.query(
      `UPDATE admins 
       SET password_hash = ?, updated_at = NOW() 
       WHERE email = 'admin@laundrygo.com'`,
      [hashedPassword]
    );

    if (result.affectedRows > 0) {
      console.log('✅ Password admin berhasil diUPDATE!');
      console.log('✅ Silakan login dengan:');
      console.log('   Email: admin@laundrygo.com');
      console.log('   Password: admin123');
    } else {
      console.log('⚠️  Admin tidak ditemukan. Mencoba INSERT...');
      
      // Jika tidak ada, insert baru
      await connection.query(
        `INSERT INTO admins (nama, email, password_hash, created_at, updated_at) 
         VALUES ('Super Admin', 'admin@laundrygo.com', ?, NOW(), NOW())`,
        [hashedPassword]
      );
      console.log('✅ Admin baru berhasil ditambahkan!');
    }

    console.log('✅ Selesai!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixAdminPassword();