const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Public route - tidak perlu login
router.get('/', async (req, res) => {
  try {
    const { kode } = req.query;

    if (!kode) {
      return res.status(400).json({ 
        success: false, 
        message: 'Kode unik wajib diisi' 
      });
    }

    const [rows] = await pool.query(
      'SELECT kode_unik, nama_pelanggan, jenis_layanan, status, tanggal_masuk, tanggal_selesai FROM laundry WHERE kode_unik = ?',
      [kode]
    );

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
    console.error('Track error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
});

module.exports = router;