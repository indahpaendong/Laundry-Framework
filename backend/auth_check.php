<?php
/**
 * LaundryGo - Authentication Middleware
 * File: backend/auth_check.php
 * Compatible with: PDO config.php + helpers.php
 * 
 * Usage: require_once 'backend/auth_check.php';
 */

require_once 'config.php';

// ===========================================
// CEK APakah USER SUDAH LOGIN
// ===========================================
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    
    // Cek apakah ini request API (AJAX)
    $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
              strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
    
    if ($isAjax) {
        sendJsonResponse(false, 'Silakan login terlebih dahulu', [
            'redirect' => '../login.html'
        ], 401);
    }
    
    // Redirect untuk request biasa
    header('Location: ../login.html');
    exit;
}

// ===========================================
// SESSION TIMEOUT (2 jam)
// ===========================================
$timeout = 7200; // 2 jam dalam detik

if (isset($_SESSION['last_activity'])) {
    if ((time() - $_SESSION['last_activity']) > $timeout) {
        // Session expired - log dulu
        if (isset($_SESSION['admin_id'])) {
            logActivity(
                $_SESSION['admin_id'],
                'session_expired',
                'admins',
                $_SESSION['admin_id'],
                "Session timeout untuk admin {$_SESSION['admin_nama']}"
            );
        }
        
        session_unset();
        session_destroy();
        header('Location: ../login.html?expired=1');
        exit;
    }
}

// ===========================================
// UPDATE LAST ACTIVITY
// ===========================================
$_SESSION['last_activity'] = time();

// ===========================================
// ADMIN INFO (Bisa dipakai di halaman)
// ===========================================
$adminInfo = [
    'id' => $_SESSION['admin_id'],
    'username' => $_SESSION['admin_username'],
    'email' => $_SESSION['admin_email'],
    'nama' => $_SESSION['admin_nama']
];
?>