const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Public route - tidak perlu login
router.get('/', async (req, res) => {
  try {
    let { kode } = req.query;

    if (!kode) {
      return res.status(400).json({
        success: false,
        message: 'Kode order wajib diisi'
      });
    }

    kode = kode.toUpperCase();

    const [rows] = await pool.query(
      `SELECT id, kode, nama_customer, no_hp, berat, harga, tanggal, status
       FROM orders
       WHERE UPPER(kode) = ?`,
      [kode]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data order tidak ditemukan'
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