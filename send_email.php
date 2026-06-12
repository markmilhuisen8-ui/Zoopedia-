<?php
header('Content-Type: application/json');

// Get POST data
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
    exit;
}

$to = $data['to'] ?? 'emergency-response@zoopedia.com';
$subject = "SOS EMERGENCY ALERT - Targeted Response";
$message = "PRIORITY EMERGENCY MESSAGE RECEIVED\n\n";
$message .= "Sent To: " . $to . "\n";
$message .= "Timestamp: " . ($data['timestamp'] ?? date('Y-m-d H:i:s')) . "\n";
$message .= "Message: " . ($data['message'] ?? 'No message provided') . "\n";
$message .= "Method: " . ($data['method'] ?? 'UNKNOWN') . "\n";
$message .= "\nCoordinates: Tracking enabled via Geolocation API\n";

$headers = "From: sos-system@zoopedia.com\r\n";
$headers .= "Reply-To: no-reply@zoopedia.com\r\n";
$headers .= "X-Priority: 1 (Highest)\n";

// Attempt to send email
// Note: mail() requires a configured SMTP server in php.ini
$sent = @mail($to, $subject, $message, $headers);

// Log it as well for redundancy
$logFile = 'sos_logs.json';
$logs = [];
if (file_exists($logFile)) {
    $logs = json_decode(file_get_contents($logFile), true) ?: [];
}
$data['status'] = $sent ? 'EMAIL_SENT' : 'EMAIL_SIMULATED_LOGGED';
$logs[] = $data;
file_put_contents($logFile, json_encode($logs, JSON_PRETTY_PRINT));

if ($sent) {
    echo json_encode(["status" => "success", "message" => "Email sent successfully"]);
} else {
    echo json_encode(["status" => "logged", "message" => "Email logged (SMTP not configured, simulation active)"]);
}
?>
