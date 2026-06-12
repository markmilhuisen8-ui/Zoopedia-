<?php
require_once 'db.php';
header('Content-Type: application/json');

$localIP = getHostByName(getHostName());
if ($localIP === '127.0.0.1' || $localIP === '::1') {
    $localIP = $_SERVER['SERVER_ADDR'] ?? '127.0.0.1';
}

echo json_encode([
    'sid' => session_id(),
    'ip' => $localIP
]);
?>
