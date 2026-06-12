<?php
// Member 1: Research Hub Feature API
// Handles storing and retrieving research notes (JSON storage)
header('Content-Type: application/json');

$file = 'research_papers.json';
$records = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        $found = array_filter($records, fn($r) => $r['id'] === $id);
        echo json_encode(array_values($found)[0] ?? ['error' => 'Not found']);
    } else {
        echo json_encode($records);
    }
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input && isset($input['title'], $input['content'])) {
        $input['id'] = count($records) > 0 ? max(array_column($records, 'id')) + 1 : 1;
        $input['date'] = date('Y-m-d');
        $input['word_count'] = str_word_count(strip_tags($input['content']));
        $records[] = $input;
        file_put_contents($file, json_encode($records, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true, 'record' => $input]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
    }
} elseif ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    $filtered = array_filter($records, fn($r) => $r['id'] !== $id);
    file_put_contents($file, json_encode(array_values($filtered), JSON_PRETTY_PRINT));
    echo json_encode(['success' => true]);
}
?>

