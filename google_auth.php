<?php
require_once 'db.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$credential = $data['credential'] ?? '';

if (!$credential) {
    echo json_encode(['success' => false, 'message' => 'No credential provided.']);
    exit;
}

// In a real app, you would verify the JWT token using Google's library.
// For this demo, we will decode the payload (unsafe for production, but works for demo).
$parts = explode('.', $credential);
if (count($parts) < 2) {
    echo json_encode(['success' => false, 'message' => 'Invalid token.']);
    exit;
}

function base64UrlDecode($input) {
    $remainder = strlen($input) % 4;
    if ($remainder) {
        $padlen = 4 - $remainder;
        $input .= str_repeat('=', $padlen);
    }
    return base64_decode(strtr($input, '-_', '+/'));
}

$payload = json_decode(base64UrlDecode($parts[1]), true);

if ($payload && isset($payload['email'])) {
    $email = $payload['email'];
    $name = $payload['name'];
    $picture = $payload['picture'];
    $google_id = $payload['sub'];

    // Check if user exists
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        // Create new user
        $stmt = $pdo->prepare("INSERT INTO users (fullname, email, profile_pic, google_id) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, $picture, $google_id]);
        
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
    }

    // Set session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['fullname'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_pic'] = $user['profile_pic'];

    echo json_encode([
        'success' => true,
        'user' => [
            'name' => $user['fullname'],
            'pic' => $user['profile_pic']
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid Google payload.']);
}

?>
