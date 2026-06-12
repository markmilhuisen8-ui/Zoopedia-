<?php
// Member 5: Dynamic SOS API
// Handles receiving geolocation data via POST and saving it securely
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit;
}

$logFile = 'sos_logs.json';
$logs = file_exists($logFile) ? (json_decode(file_get_contents($logFile), true) ?: []) : [];
$logs[] = $data;

if (file_put_contents($logFile, json_encode($logs, JSON_PRETTY_PRINT))) {
    echo json_encode(["status" => "success", "message" => "SOS log saved"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to write log"]);
}N
?>
