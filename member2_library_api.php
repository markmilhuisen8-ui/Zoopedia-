<?php
// Member 2: Cloud Digital Library Feature API
// Handles loading and deleting artifacts from the MySQL database
session_start();
header('Content-Type: application/json');

$userId = $_SESSION['user_id'] ?? 0;
$action = $_GET['action'] ?? '';

try {
    $pdo = new PDO("mysql:host=localhost;dbname=zoopedia", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Ensure table exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS digital_library (
        id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL, url TEXT NOT NULL, category VARCHAR(50) DEFAULT 'upload',
        date DATE NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    if ($action === 'load') {
        if (!$userId) { echo json_encode([]); exit; }
        $stmt = $pdo->prepare("SELECT * FROM digital_library WHERE user_id = ? ORDER BY id DESC");
        $stmt->execute([$userId]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } elseif ($action === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM digital_library WHERE id = ? AND user_id = ?");
        $stmt->execute([$_GET['id'] ?? 0, $userId]);
        echo json_encode(['status' => 'deleted']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'DB Error: ' . $e->getMessage()]);
}
?>