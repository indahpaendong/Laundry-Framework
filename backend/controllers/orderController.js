const pool = require('../config/db');

// GET semua order
exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM orders ORDER BY id DESC'
    );

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data order'
    });
  }
};

// GET order by id
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail order'
    });
  }
};

// CREATE order
exports.createOrder = async (req, res) => {
  try {
    const { nama_customer, no_hp, berat, harga, tanggal, status } = req.body;

    if (!nama_customer || !berat || !harga || !tanggal) {
      return res.status(400).json({
        success: false,
        message: 'Nama customer, berat, harga, dan tanggal wajib diisi'
      });
    }

    let kode;
let isUnique = false;

while (!isUnique) {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  kode = 'LDY' + randomNumber;

  const [existing] = await pool.query(
    'SELECT id FROM orders WHERE kode = ?',
    [kode]
  );

  if (existing.length === 0) {
    isUnique = true;
  }
}

    await pool.query(
      `INSERT INTO orders 
       (kode, nama_customer, no_hp, berat, harga, tanggal, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        kode,
        nama_customer,
        no_hp || '',
        berat,
        harga,
        tanggal,
        status || 'Diproses'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Order berhasil ditambahkan'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan order'
    });
  }
};

// UPDATE order
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_customer, no_hp, berat, harga, tanggal, status } = req.body;

    const [result] = await pool.query(
      `UPDATE orders 
       SET nama_customer = ?, no_hp = ?, berat = ?, harga = ?, tanggal = ?, status = ?
       WHERE id = ?`,
      [nama_customer, no_hp, berat, harga, tanggal, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Order berhasil diperbarui'
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui order'
    });
  }
};

// DELETE order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM orders WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Order berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus order'
    });
  }
};