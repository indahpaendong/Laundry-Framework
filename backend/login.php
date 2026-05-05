<?php
/**
 * LaundryGo - Admin Login
 * File: backend/login.php
 * Method: POST
 * Compatible with: PDO config.php + helpers.php
 */

require_once 'config.php';

// Hanya terima method POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, 'Method tidak diizinkan. Gunakan POST.', null, 405);
}

// Sanitize semua input POST sekaligus (helpers.php support array!)
$post = sanitize($_POST);

$email = $post['email'] ?? '';
$password = $_POST['password'] ?? ''; // Password jangan di-sanitize untuk verify
$remember = isset($post['remember']);

// ===========================================
// VALIDASI INPUT
// ===========================================
if (empty($email)) {
    sendJsonResponse(false, 'Email harus diisi');
}

if (empty($password)) {
    sendJsonResponse(false, 'Password harus diisi');
}

// Validasi email (tidak ada di helpers, pakai native PHP)
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse(false, 'Format email tidak valid');
}

// ===========================================
// CEK KREDENSIAL DI DATABASE (PDO)
// ===========================================
try {
    $pdo = getDbConnection();
    
    // Prepared statement dengan positional placeholder (?)
    $stmt = $pdo->prepare("
        SELECT id, username, email, password, nama_lengkap 
        FROM admins 
        WHERE email = ? 
        LIMIT 1
    ");
    $stmt->execute([$email]);
    $admin = $stmt->fetch();
    
    // Jika email tidak ditemukan
    if (!$admin) {
        sendJsonResponse(false, 'Email atau password salah');
    }
    
    // ===========================================
    // VERIFIKASI PASSWORD
    // ===========================================
    if (!password_verify($password, $admin['password'])) {
        sendJsonResponse(false, 'Email atau password salah');
    }
    
    // ===========================================
    // SET SESSION
    // ===========================================
    $_SESSION['admin_id'] = $admin['id'];
    $_SESSION['admin_username'] = $admin['username'];
    $_SESSION['admin_email'] = $admin['email'];
    $_SESSION['admin_nama'] = $admin['nama_lengkap'];
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['login_time'] = date('Y-m-d H:i:s');
    $_SESSION['last_activity'] = time();
    
    // ===========================================
    // REMEMBER ME (Cookie 30 hari)
    // ===========================================
    if ($remember) {
        $token = bin2hex(random_bytes(32));
        setcookie('laundrygo_remember', $token, [
            'expires' => time() + (30 * 24 * 60 * 60),
            'path' => '/',
            'secure' => false, // Set true jika production + HTTPS
            'httponly' => true,
            'samesite' => 'Lax'
        ]);
    }
    
    // ===========================================
    // LOG ACTIVITY (pakai helpers.php)
    // ===========================================
    logActivity(
        $admin['id'],           // admin_id
        'login',                // action
        'admins',               // table_name
        $admin['id'],           // record_id
        "Admin {$admin['nama_lengkap']} login berhasil" // description
    );
    
    // ===========================================
    // RETURN SUCCESS
    // ===========================================
    sendJsonResponse(true, 'Login berhasil', [
        'redirect' => '../dashboard.html',
        'admin' => [
            'id' => $admin['id'],
            'nama' => $admin['nama_lengkap'],
            'email' => $admin['email'],
            'username' => $admin['username']
        ]
    ]);
    
} catch (PDOException $e) {
    if (DEBUG_MODE) {
        sendJsonResponse(false, 'Database error: ' . $e->getMessage(), null, 500);
    }
    sendJsonResponse(false, 'Terjadi kesalahan sistem', null, 500);
}
?>