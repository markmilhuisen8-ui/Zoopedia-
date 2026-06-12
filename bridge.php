<?php
// ALEX OLLAMA BRIDGE - Local AI Proxy (Phi-3 Edition)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Local Ollama API (Zero Internet Required)
$url = "http://localhost:11434/api/chat";

$payload = [
    "model" => "phi3", // Using the fast Phi-3 model
    "messages" => $data['messages'],
    "stream" => false 
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);

$response = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

if ($err) {
    echo json_encode(["status" => "error", "message" => "Ollama service unavailable. Sir, check your terminal."]);
} else {
    echo $response;
}
?>
