<?php
// Member 4: QR Code Magic Hand-off API
// Handles asynchronous polling from the desktop UI to detect mobile scans
session_start();
header('Content-Type: application/json');

$signalFile = 'scan_signal.json';
// Accept token from GET parameter (used by pollScanStatus) or fallback to session_id()
$sid = $_GET['token'] ?? session_id();

if (file_exists($signalFile)) {
    $signals = json_decode(file_get_contents($signalFile), true) ?: [];
    if (!empty($signals[$sid]['scanned'])) {
        // Clear the signal so it only triggers once
        unset($signals[$sid]);
        file_put_contents($signalFile, json_encode($signals));
        echo json_encode(['status' => 'scanned', 'scanned' => true]);
        exit;
    }
}

echo json_encode(['status' => 'waiting', 'scanned' => false]);
?>
