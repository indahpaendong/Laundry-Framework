<?php
// backend/helpers.php

/**
 * Sanitize input untuk mencegah XSS
 */
function sanitize($input) {
    if (is_array($input)) {
        return array_map('sanitize', $input);
    }
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

/**
 * Generate kode unik laundry
 * Format: LDY{YYYYMMDD}{RANDOM}
 * Contoh: LDY20260505AB12
 */
function generateKodeUnik($prefix = 'LDY') {
    $date = date('Ymd');
    $random = strtoupper(substr(bin2hex(random_bytes(2)), 0, 4));
    return $prefix . $date . $random;
}

/**
 * Format angka ke Rupiah
 */
function formatRupiah($angka) {
    return 'Rp ' . number_format($angka, 0, ',', '.');
}

/**
 * Validasi nomor HP Indonesia
 */
function isValidPhone($phone) {
    return preg_match('/^(\+62|62|0)8[1-9][0-9]{6,10}$/', 
        preg_replace('/[\s\-\(\)]/', '', $phone));
}

/**
 * Hitung harga berdasarkan layanan dan berat
 */
function hitungHarga($jenis_layanan, $berat_kg) {
    $harga_per_kg = [
        'cuci_kering' => 15000,
        'cuci_setrika' => 12000,
        'kering_saja' => 10000,
        'express' => 20000
    ];
    
    $base_price = $harga_per_kg[$jenis_layanan] ?? 15000;
    $total = $base_price * $berat_kg;
    
    // Minimum charge 2kg
    if ($berat_kg < 2) {
        $total = $base_price * 2;
    }
    
    return round($total);
}

/**
 * Log activity ke database
 */
function logActivity($admin_id, $action, $table_name, $record_id, $description) {
    try {
        $pdo = getDbConnection();
        $stmt = $pdo->prepare("
            INSERT INTO activity_log (admin_id, action, table_name, record_id, description) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$admin_id, $action, $table_name, $record_id, $description]);
    } catch (Exception $e) {
        error_log("Activity log failed: " . $e->getMessage());
    }
}
?>