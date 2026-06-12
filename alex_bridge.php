<?php
// ALEX BRIDGE - Enhanced Error Reporting
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(["choices" => [["message" => ["content" => "Sir, the bridge received no data. Check your Browser Console (F12)."]]]]);
    exit;
}

$apiKey = $data['key'];
$apiUrl = "https://openrouter.ai/api/v1/chat/completions";

$payload = [
    "model" => $data['model'],
    "messages" => $data['messages']
];

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer " . $apiKey,
    "HTTP-Referer: http://localhost" 
]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    echo json_encode(["choices" => [["message" => ["content" => "Local CURL Error: " . curl_error($ch)]]]]);
} else if ($http_code !== 200) {
    // Return the actual error message from OpenRouter
    $errObj = json_decode($response, true);
    $msg = $errObj['error']['message'] ?? "OpenRouter Error Code " . $http_code;
    echo json_encode(["choices" => [["message" => ["content" => "Sir, OpenRouter reports: " . $msg]]]]);
} else {
    echo $response;
}

curl_close($ch);
?>
