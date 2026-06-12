<?php
// Simple server check endpoint
header('Content-Type: application/json');
echo json_encode(["status" => "online", "message" => "Infrastructure reachable"]);
?>
