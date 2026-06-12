<?php
// memory_service.php - Finalized Backend for Zoopedia Memory Card Editor
header('Content-Type: application/json');

$action = $_POST['action'] ?? '';

if ($action === 'save_and_email') {
    $jsonFile = 'memory_cards.json';
    $records = [];
    
    if (file_exists($jsonFile)) {
        $jsonData = file_get_contents($jsonFile);
        $records = json_decode($jsonData, true) ?? [];
    }
    
    $design_id = uniqid('mem_');
    $title = $_POST['title'] ?? 'My Memory Card';
    $tagline = $_POST['tagline'] ?? '';
    $quote = $_POST['quote'] ?? '';
    $gradient = $_POST['gradient'] ?? '';
    $user_email = filter_var($_POST['user_email'], FILTER_SANITIZE_EMAIL);
    
    // 1. Handle the Captured Final Card Image (Base64 from html2canvas)
    $final_card_image_url = '';
    if (!empty($_POST['card_image'])) {
        $imgData = $_POST['card_image'];
        if (preg_match('/^data:image\/(\w+);base64,/', $imgData, $type)) {
            $imgData = substr($imgData, strpos($imgData, ',') + 1);
            $imgData = base64_decode($imgData);
            $uploadDir = 'img/uploads/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            
            $card_img_name = 'final_card_' . $design_id . '.png';
            file_put_contents($uploadDir . $card_img_name, $imgData);
            $final_card_image_url = $uploadDir . $card_img_name;
        }
    }

    // 2. Save record to JSON
    $newRecord = [
        'id' => $design_id,
        'title' => $title,
        'tagline' => $tagline,
        'quote' => $quote,
        'gradient' => $gradient,
        'image_url' => $final_card_image_url,
        'user_email' => $user_email,
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    $records[] = $newRecord;
    
    if (file_put_contents($jsonFile, json_encode($records, JSON_PRETTY_PRINT))) {
        // Link to the beautiful landing page
        $shareLink = "http://localhost/Zoopedia-main/share_card.php?id=" . $design_id;
        $localEmailFile = null;

        // 3. SEND EMAIL LOGIC (Simulated on Localhost)
        if (filter_var($user_email, FILTER_VALIDATE_EMAIL)) {
            $subject = "Your Zoopedia Digital Memory Card: " . $title;
            
            $message = "
            <html>
            <head>
            <title>Zoopedia Memory Card</title>
            </head>
            <body style='font-family: Arial, sans-serif; background-color: #1c1c1e; color: #ffffff; padding: 20px; text-align: center;'>
                <h2 style='color: #0071e3;'>Your Digital Memory Card is Ready!</h2>
                <p style='color: #86868b; margin-bottom: 30px;'>Here is the beautiful wildlife card you designed on Zoopedia Prime:</p>
                <a href='{$shareLink}'><img src='{$_POST['card_image']}' alt='Memory Card' style='max-width: 100%; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);'></a>
                <br><br>
                <a href='{$shareLink}' style='background: #0071e3; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;'>View Your Special Card Page</a>
                <br><br>
                <p style='font-size: 12px; color: #666;'>&copy; 2026 Zoopedia Prime. All rights reserved.</p>
            </body>
            </html>
            ";

            $headers = "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
            $headers .= "From: no-reply@zoopedia.com" . "\r\n";

            // Local simulation
            $mailFolder = 'sent_emails';
            if (!is_dir($mailFolder)) mkdir($mailFolder, 0777, true);
            $localEmailFile = $mailFolder . '/email_' . $design_id . '.html';
            
            $simContent = "<div style='background:#eee; padding:10px; font-family:monospace;'>[LOCAL SIM] To: $user_email</div>" . $message;
            file_put_contents($localEmailFile, $simContent);

            @mail($user_email, $subject, $message, $headers);
        }
        
        echo json_encode([
            'status' => 'success', 
            'design_id' => $design_id,
            'local_email_link' => $localEmailFile
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to save record']);
    }
}
?>
