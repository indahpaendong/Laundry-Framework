// Generate kode unik laundry
exports.generateKodeUnik = (prefix = 'LDY') => {
  const date = new Date().toISOString().slice(0,10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${date}${random}`;
};

// Hitung harga berdasarkan jenis layanan
exports.hitungHarga = (jenis_layanan, berat_kg) => {
  const hargaPerKg = {
    'cuci_kering': 15000,
    'cuci_setrika': 12000,
    'kering_saja': 10000,
    'express': 20000
  };
  
  const harga = hargaPerKg[jenis_layanan] || 15000;
  const berat = Math.max(parseFloat(berat_kg), 2); // Minimum 2kg
  
  return Math.round(harga * berat);
};

// Sanitize input (cegah XSS)
exports.sanitize = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '').trim();
};

// Format rupiah
exports.formatRupiah = (angka) => {
  return 'Rp ' + parseInt(angka).toLocaleString('id-ID');
};