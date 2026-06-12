<?php
/**
 * Zoopedia Prime — Wildlife Vault Service
 * Handles persistent storage for Knowledge Blocks via AJAX.
 */

$dataFile = 'vault_data.json';

// Initialize data file if it doesn't exist
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([
        ["id" => 1, "type" => "image", "title" => "Ancient Jaguar Cave Sketch", "url" => "https://images.unsplash.com/photo-1574068468668-a05a11f871da", "date" => date('Y-m-d')],
        ["id" => 2, "type" => "video", "title" => "Ocean Bio-Luminescence", "url" => "https://www.w3schools.com/html/mov_bbb.mp4", "date" => date('Y-m-d')]
    ], JSON_PRETTY_PRINT));
}

$action = $_GET['action'] ?? '';

if ($action === 'load') {
    header('Content-Type: application/json');
    echo file_get_contents($dataFile);
    exit;
}

if ($action === 'save') {
    $input = file_get_contents('php://input');
    $newItem = json_decode($input, true);
    
    if ($newItem) {
        $data = json_decode(file_get_contents($dataFile), true);
        array_unshift($data, $newItem); // Add new item to top
        file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
        echo json_encode(['status' => 'success']);
    }
    exit;
}
?>
