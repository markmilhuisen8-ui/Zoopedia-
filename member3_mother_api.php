<?php
// Member 3: Mother's Day Card API
// Handles uploading the generated canvas image (blob) to the server
session_start();
header('Content-Type: application/json');

$userId = $_SESSION['user_id'] ?? 0;
$category = $_POST['category'] ?? 'saved';

if (!$userId && $category !== 'research_lab') {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in. Please sign in to save items.']);
    exit;
}

$uploadDir = 'library_uploads/';
if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);

$title = $_POST['title'] ?? 'Untitled Card';
$type = $_POST['type'] ?? 'image';
$url = $_POST['url'] ?? '';

if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $url = $uploadDir . time() . '_' . basename($_FILES['file']['name']);
    move_uploaded_file($_FILES['file']['tmp_name'], $url);
}

if ($url) {
    try {
        $pdo = new PDO("mysql:host=localhost;dbname=zoopedia", "root", "");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $pdo->exec("CREATE TABLE IF NOT EXISTS digital_library (
            id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, title VARCHAR(255) NOT NULL,
            type VARCHAR(50) NOT NULL, url TEXT NOT NULL, category VARCHAR(50) DEFAULT 'upload',
            date DATE NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $stmt = $pdo->prepare("INSERT INTO digital_library (user_id, title, type, url, category, date) VALUES (?, ?, ?, ?, ?, ?)");
        $date = date('Y-m-d');
        if ($stmt->execute([$userId, $title, $type, $url, $category, $date])) {
            echo json_encode(['status' => 'success', 'item' => ['id' => $pdo->lastInsertId(), 'title' => $title, 'url' => $url]]);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'SQL Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'No file or URL provided']);
}
?>