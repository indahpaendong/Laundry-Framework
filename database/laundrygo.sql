-- ==========================================
-- LaundryGo Database Setup
-- File: laundrygo.sql
-- PIC: Member 1 (Database & Configuration)
-- Tanggal: 2026-05-05
-- ==========================================

-- 1. Buat Database
CREATE DATABASE IF NOT EXISTS laundrygo 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE laundrygo;

-- ==========================================
-- 2. Tabel: admins
-- ==========================================
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 3. Tabel: laundry
-- ==========================================
CREATE TABLE laundry (
    id INT PRIMARY KEY AUTO_INCREMENT,
    kode_unik VARCHAR(20) UNIQUE NOT NULL,
    nama_pelanggan VARCHAR(100) NOT NULL,
    no_hp VARCHAR(20) NOT NULL,
    jenis_layanan ENUM('cuci_kering', 'cuci_setrika', 'kering_saja', 'express') NOT NULL,
    berat_kg DECIMAL(5,2) NOT NULL,
    harga_total DECIMAL(10,2) NOT NULL,
    status ENUM('diterima', 'dicuci', 'dibilas', 'dikeringkan', 'disetrika', 'selesai') DEFAULT 'diterima',
    tanggal_masuk DATETIME DEFAULT CURRENT_TIMESTAMP,
    tanggal_selesai DATETIME NULL,
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_kode (kode_unik),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 4. Tabel: activity_log
-- ==========================================
CREATE TABLE activity_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NULL,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL,
    INDEX idx_admin (admin_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 5. Seed Data: Default Admin
-- Email: admin@laundrygo.com
-- Password: admin123 (bcrypt)
-- ==========================================
INSERT INTO admins (nama, email, password_hash) VALUES 
('Super Admin', 'admin@laundrygo.com', '$2b$10$QMpR0VwwaPX6JepYomjyK.Y5KYfQwYbNrnmvi90k9DK20e7h4ltTu');

-- ==========================================
-- 6. Seed Data: Dummy Laundry (Testing)
-- ==========================================
INSERT INTO laundry (kode_unik, nama_pelanggan, no_hp, jenis_layanan, berat_kg, harga_total, status, catatan) VALUES
('LDY20260505AB01', 'Budi Santoso', '081234567890', 'cuci_kering', 5.00, 75000.00, 'selesai', 'Paket hemat'),
('LDY20260505AB02', 'Siti Aminah', '081298765432', 'express', 2.50, 50000.00, 'dicuci', 'Butuh cepat'),
('LDY20260505AB03', 'Ahmad Rizki', '081345678901', 'cuci_setrika', 4.00, 48000.00, 'diterima', NULL);

-- ==========================================
-- 7. Verifikasi
-- ==========================================
SELECT '✅ Database laundrygo berhasil dibuat & siap digunakan!' AS status;
SHOW TABLES;

$2b$10$4kW3RUieJEhcXo/mAdT2DO3B9WvOhMTLMOrJFs1d1jdPV/6aqzF62