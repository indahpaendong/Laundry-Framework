<?php
/**
 * LaundryGo - Admin Logout
 * File: backend/logout.php
 * Compatible with: PDO config.php + helpers.php
 */

require_once 'config.php';

// Log activity sebelum logout (jika session ada)
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    logActivity(
        $_SESSION['admin_id'] ?? null,
        'logout',
        'admins',
        $_SESSION['admin_id'] ?? null,
        "Admin {$_SESSION['admin_nama']} logout"
    );
}

// ===========================================
// DESTROY SESSION
// ===========================================
$_SESSION = array();

if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', [
        'expires' => time() - 3600,
        'path' => '/',
        'secure' => false,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
}

session_destroy();

// ===========================================
// HAPUS REMEMBER ME COOKIE
// ===========================================
if (isset($_COOKIE['laundrygo_remember'])) {
    setcookie('laundrygo_remember', '', [
        'expires' => time() - 3600,
        'path' => '/',
        'secure' => false,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
}

// ===========================================
// REDIRECT KE LOGIN
// ===========================================
header('Location: ../login.html');
exit;
?>