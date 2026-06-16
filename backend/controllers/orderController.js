const pool = require('../config/db');

// GET semua order
exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY id DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data order' });
  }
};

// GET order by id
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil detail order' });
  }
};

// CREATE order
exports.createOrder = async (req, res) => {
  try {
    const { nama_customer, no_hp, berat, harga, tanggal, estimasi_selesai, layanan, catatan, status } = req.body;

    if (!nama_customer || !berat || !harga || !tanggal) {
      return res.status(400).json({ success: false, message: 'Nama customer, berat, harga, dan tanggal wajib diisi' });
    }

    let kode;
    let isUnique = false;
    while (!isUnique) {
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      kode = 'LDY' + randomNumber;
      const [existing] = await pool.query('SELECT id FROM orders WHERE kode = ?', [kode]);
      if (existing.length === 0) isUnique = true;
    }

    // Format tanggal untuk MySQL
    const tanggalMySql = tanggal.replace('T', ' ') + ':00';
    const estimasiMySql = estimasi_selesai ? estimasi_selesai.replace('T', ' ') + ':00' : null;

    await pool.query(
      `INSERT INTO orders (kode, nama_customer, no_hp, berat, harga, tanggal, estimasi_selesai, layanan, catatan, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [kode, nama_customer, no_hp || '', berat, harga, tanggalMySql, estimasiMySql, layanan || '', catatan || '', status || 'Diproses']
    );

    res.status(201).json({ success: true, message: 'Order berhasil ditambahkan', data: { kode } });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan order: ' + error.message });
  }
};

// ✅ UPDATE order - PERTAHANKAN NILAI LAMA
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_customer, no_hp, berat, harga, status } = req.body;

    // Ambil data existing
    const [existingRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });
    }

    const existing = existingRows[0];

    console.log('📝 Update order:', {
      id,
      status_baru: status,
      status_lama: existing.status
    });

    // ✅ HANYA update field yang dikirim, pertahankan yang lain
    const [result] = await pool.query(
      `UPDATE orders 
       SET nama_customer = ?, no_hp = ?, berat = ?, harga = ?, status = ?
       WHERE id = ?`,
      [
        nama_customer !== undefined ? nama_customer : existing.nama_customer,
        no_hp !== undefined ? no_hp : existing.no_hp,
        berat !== undefined ? berat : existing.berat,
        harga !== undefined ? harga : existing.harga,
        status !== undefined ? status : existing.status,
        id
      ]
    );

    res.json({ success: true, message: 'Order berhasil diperbarui' });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui order: ' + error.message });
  }
};

// DELETE order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });
    }
    res.json({ success: true, message: 'Order berhasil dihapus' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus order' });
  }
};