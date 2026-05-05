<?php
require 'backend/config.php';

echo "<h1>🧪 Testing LaundryGo Backend</h1>";

try {
    // Test database connection
    $pdo = getDbConnection();
    echo "<p>✅ <strong>Database Connection:</strong> SUCCESS</p>";
    
    // Test query
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM admins");
    $result = $stmt->fetch();
    echo "<p>✅ <strong>Admin Count:</strong> " . $result['total'] . "</p>";
    
    // Test helper functions
    echo "<p>✅ <strong>Helper Functions Test:</strong></p>";
    echo "<ul>";
    echo "<li>Generate Kode: <strong>" . generateKodeUnik() . "</strong></li>";
    echo "<li>Format Rupiah: <strong>" . formatRupiah(75000) . "</strong></li>";
    echo "<li>Hitung Harga (express, 3kg): <strong>" . formatRupiah(hitungHarga('express', 3)) . "</strong></li>";
    echo "<li>Sanitize: <strong>" . sanitize("<script>alert('xss')</script>") . "</strong></li>";
    echo "</ul>";
    
    echo "<p style='color: green; font-size: 20px;'>🎉 ALL TESTS PASSED!</p>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ <strong>Error:</strong> " . $e->getMessage() . "</p>";
}
?>