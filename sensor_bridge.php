<?php
header('Content-Type: application/json');
$file = 'sensor_state.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Check if this is a reset command
    if (isset($input['reset']) && $input['reset'] === true) {
        if (file_exists($file)) unlink($file);
        echo json_encode(['success' => true, 'message' => 'Sensor Reset']);
        exit;
    }

    $pressure = $input['pressure'] ?? 0;
    $verified = $input['verified'] ?? false;
    $failed = $input['failed'] ?? false;
    $laptop_active = $input['laptop_active'] ?? null;
    
    // Read current state to preserve laptop_active if not provided
    $current = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    
    $data = [
        'triggered' => ($pressure > 0), 
        'pressure' => $pressure, 
        'verified' => $verified,
        'failed' => $failed,
        'laptop_active' => ($laptop_active !== null) ? $laptop_active : ($current['laptop_active'] ?? false),
        'time' => time()
    ];
    file_put_contents($file, json_encode($data));
    echo json_encode(['success' => true]);
} else {
    // Desktop checks the sensor
    if (file_exists($file)) {
        $data = json_decode(file_get_contents($file), true);
        // Reset after 60 seconds to avoid stale triggers and handle clock desync
        if (time() - $data['time'] > 60) {
            unlink($file);
            echo json_encode(['triggered' => false]);
        } else {
            echo json_encode($data);
            // Don't unlink immediately, let it expire after 5 seconds
        }
    } else {
        echo json_encode(['triggered' => false]);
    }
}
?>
