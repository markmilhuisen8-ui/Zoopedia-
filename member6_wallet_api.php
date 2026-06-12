<?php
// Member 6: Tap to Pay / Wallet API
// Handles secure asynchronous form processing for adding and retrieving cards
session_start();
header('Content-Type: application/json');

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    echo json_encode(['success' => false, 'message' => 'Not Logged In']);
    exit;
}

$action = $_GET['action'] ?? '';

try {
    $pdo = new PDO("mysql:host=localhost;dbname=zoopedia", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Ensure table exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS user_cards (
        id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, card_holder VARCHAR(255),
        card_number VARCHAR(255), expiry_date VARCHAR(50), card_type VARCHAR(50)
    )");

    if ($action === 'fetch') {
        $stmt = $pdo->prepare("SELECT id, card_holder, card_number, expiry_date, card_type FROM user_cards WHERE user_id = ?");
        $stmt->execute([$userId]);
        $cards = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Mask card numbers for security (e.g., **** **** **** 1234)
        foreach ($cards as &$card) {
            $card['masked_number'] = "**** **** **** " . substr($card['card_number'], -4);
        }
        echo json_encode(['success' => true, 'cards' => $cards]);
        
    } elseif ($action === 'add') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['number']) || empty($data['holder'])) {
            echo json_encode(['success' => false, 'message' => 'Missing Data']);
            exit;
        }
        
        // Determine Card Type (Simple Logic)
        $type = (strpos($data['number'], '5') === 0) ? 'Mastercard' : ((strpos($data['number'], '3') === 0) ? 'Amex' : 'Visa');
        
        $stmt = $pdo->prepare("INSERT INTO user_cards (user_id, card_holder, card_number, expiry_date, card_type) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $data['holder'], $data['number'], $data['expiry'] ?? '', $type]);
        
        echo json_encode(['success' => true, 'message' => 'Card Added to Wallet']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
}
?>
