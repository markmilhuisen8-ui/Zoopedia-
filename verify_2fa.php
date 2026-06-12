<?php
require_once 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $otp = $_POST['otp'] ?? '';
    
    if (isset($_SESSION['otp_code']) && $otp === $_SESSION['otp_code']) { 
        if (isset($_SESSION['temp_user_id'])) {
            $user_id = $_SESSION['temp_user_id'];
            
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$user_id]);
            $user = $stmt->fetch();
            
            if ($user) {
                unset($_SESSION['temp_user_id']);
                unset($_SESSION['otp_code']); // Clear the OTP after use
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
                exit;
            }
        }
    }
    
    echo json_encode(['success' => false, 'message' => 'Verification failed.']);
}
?>
