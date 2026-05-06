const pool = require('../config/db');
const { generateKodeUnik, hitungHarga, sanitize } = require('../utils/helpers');

// Get semua data laundry
exports.getAll = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = 'SELECT * FROM laundry WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (nama_pelanggan LIKE ? OR kode_unik LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error('Get laundry error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
};

// Get laundry by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM laundry WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Data laundry tidak ditemukan' 
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    console.error('Get by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
};

// Create laundry baru
exports.create = async (req, res) => {
  try {
    const { nama_pelanggan, no_hp, jenis_layanan, berat_kg, catatan } = req.body;

    // Validasi
    if (!nama_pelanggan || !no_hp || !jenis_layanan || !berat_kg) {
      return res.status(400).json({ 
        success: false, 
        message: 'Semua field wajib diisi' 
      });
    }

    const kode_unik = generateKodeUnik();
    const harga_total = hitungHarga(jenis_layanan, berat_kg);

    const [result] = await pool.query(
      `INSERT INTO laundry (kode_unik, nama_pelanggan, no_hp, jenis_layanan, berat_kg, harga_total, catatan) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [kode_unik, sanitize(nama_pelanggan), no_hp, jenis_layanan, berat_kg, harga_total, catatan]
    );

    res.status(201).json({
      success: true,
      message: 'Data laundry berhasil ditambahkan',
      data: {
        id: result.insertId,
        kode_unik,
        harga_total
      }
    });

  } catch (error) {
    console.error('Create laundry error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal menambah data: ' + error.message 
    });
  }
};

// Update data laundry lengkap
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_pelanggan, no_hp, jenis_layanan, berat_kg, catatan, status } = req.body;

    // Cek data ada atau tidak
    const [checkRows] = await pool.query(
      'SELECT * FROM laundry WHERE id = ?',
      [id]
    );

    if (checkRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data laundry tidak ditemukan'
      });
    }

    // Validasi input
    if (!nama_pelanggan || !no_hp || !jenis_layanan || !berat_kg) {
      return res.status(400).json({
        success: false,
        message: 'Nama pelanggan, nomor HP, jenis layanan, dan berat wajib diisi'
      });
    }

    const jenisLayananValid = ['cuci_kering', 'cuci_setrika', 'kering_saja', 'express'];

    if (!jenisLayananValid.includes(jenis_layanan)) {
      return res.status(400).json({
        success: false,
        message: 'Jenis layanan tidak valid'
      });
    }

    const berat = parseFloat(berat_kg);

    if (berat <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Berat laundry harus lebih dari 0'
      });
    }

    const harga_total = hitungHarga(jenis_layanan, berat);

    const statusBaru = status || checkRows[0].status;

    await pool.query(
      `UPDATE laundry 
       SET nama_pelanggan = ?, 
           no_hp = ?, 
           jenis_layanan = ?, 
           berat_kg = ?, 
           harga_total = ?, 
           status = ?, 
           catatan = ?
       WHERE id = ?`,
      [
        sanitize(nama_pelanggan),
        no_hp,
        jenis_layanan,
        berat,
        harga_total,
        statusBaru,
        catatan || null,
        id
      ]
    );

    const [updatedRows] = await pool.query(
      'SELECT * FROM laundry WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Data laundry berhasil diupdate',
      data: updatedRows[0]
    });

  } catch (error) {
    console.error('Update laundry error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal update data: ' + error.message
    });
  }
};

// Update status laundry
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const statusValid = [
      'diterima',
      'dicuci',
      'dibilas',
      'dikeringkan',
      'disetrika',
      'selesai'
    ];

    if (!statusValid.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }

    const [checkRows] = await pool.query(
      'SELECT * FROM laundry WHERE id = ?',
      [id]
    );

    if (checkRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data laundry tidak ditemukan'
      });
    }

    let tanggal_selesai = checkRows[0].tanggal_selesai;

    if (status === 'selesai') {
      tanggal_selesai = new Date();
    }

    const [result] = await pool.query(
      'UPDATE laundry SET status = ?, tanggal_selesai = ? WHERE id = ?',
      [status, tanggal_selesai, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data laundry tidak ditemukan'
      });
    }

    const [updatedRows] = await pool.query(
      'SELECT * FROM laundry WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Status berhasil diupdate',
      data: updatedRows[0]
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal update status: ' + error.message
    });
  }
};

// Delete laundry
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM laundry WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Data laundry tidak ditemukan' 
      });
    }

    res.json({
      success: true,
      message: 'Data laundry berhasil dihapus'
    });

  } catch (error) {
    console.error('Delete laundry error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal hapus data: ' + error.message 
    });
  }
};