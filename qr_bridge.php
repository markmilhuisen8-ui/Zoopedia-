<?php
// qr_bridge.php - Bridge between Mobile Scan and Laptop Session

// 1. Capture the Laptop's Session ID from the URL
$sid = $_GET['sid'] ?? '';
if (!empty($sid) && preg_match('/^[a-zA-Z0-9,-]{1,128}$/', $sid)) {
    if (session_status() !== PHP_SESSION_NONE) {
        session_write_close();
    }
    session_id($sid);
}

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params(0, '/');
    session_start();
}

// 2. SIGNAL THE SCAN: Mark this specific SID as scanned in the global signal file
$signalFile = 'scan_signal.json';
$signals = [];
if (file_exists($signalFile)) {
    $signals = json_decode(file_get_contents($signalFile), true) ?: [];
}

// Mark this session as "Just Scanned"
// We use both the current session_id (which should match laptop) and the GET sid for redundancy
$targetSid = !empty($sid) ? $sid : session_id();
$signals[$targetSid] = ['scanned' => true, 'time' => time()];

// Save to file
file_put_contents($signalFile, json_encode($signals));

// 3. Redirect to the Global gallery
// Check if ZoopediaGlobal exists in the sibling directory
$redirectUrl = "../ZoopediaGlobal/index.html";
header("Location: $redirectUrl");
exit();
?>
